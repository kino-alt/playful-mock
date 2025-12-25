import { http, HttpResponse, delay, ws } from 'msw'

const API_BASE_URL = "";
const WS_BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
  : "ws://localhost:3000";

// 1. WebSocketリンクの作成
const gameWs = ws.link(`${WS_BASE_URL}/api/rooms/:room_id/ws`);
let timerInterval: NodeJS.Timeout | null = null;
const allClients = new Set<any>();

const broadcast = (message: object) => {
  const msgString = JSON.stringify(message);
  
  allClients.forEach((client) => {
    // 🔴 接続が OPEN (1) 以外なら即削除して送信をスキップ
    if (client.readyState !== 1) {
      allClients.delete(client);
      return;
    }

    try {
      client.send(msgString);
    } catch (e) {
      console.error("[MSW] Send failed, removing client", e);
      allClients.delete(client);
    }
  });
};

let currentParticipants = [
  { user_id: "dummy1", user_name: "たいよう", role: "player", is_Leader: false },
  { user_id: "dummy2", user_name: "しょう", role: "player", is_Leader: false },
];

const broadcastParticipants = () => {
  console.log("[MSW] Broadcasting updated list:", currentParticipants);
  broadcast({
    type: 'PARTICIPANT_UPDATE',
    payload: {
      participants: currentParticipants
    }
  });
};


// Register WebSocket connection handler on the ws.link instance
gameWs.addEventListener('connection', ({ client }) => {
  allClients.add(client);
  console.log("[MSW] New Connection. Total:", allClients.size);

  // 🔴 誰かが入室（接続）したら、即座に最新のリストを全員（ホスト含む）に送る
  setTimeout(() => {
    broadcastParticipants();
  }, 500);

  client.addEventListener('message', (event) => {
    // 🔴 受信自体ができているかログを出す
    console.log("[MSW] Received message from client:", event.data);
    
    const data = JSON.parse(event.data as string);
    if (data.type === 'FETCH_PARTICIPANTS') {
      console.log("[MSW] Manual fetch requested");
      broadcastParticipants();
    }

    if (data.type === 'WAITING') {
      broadcast({
        type: 'STATE_UPDATE',
        payload: { nextState: "setting_topic" }
      });
      return;
    }

    if (data.type === 'CHECKING') {
      broadcast({
        type: 'STATE_UPDATE',
        payload: { nextState: "finished" }
      });
      return;
    }

    if (data.type === 'ANSWERING') {
      broadcast({
        type: 'STATE_UPDATE',
        payload: {
          nextState: "checking",
          data: { answer: data.payload.answer }
        }
      });
      return;
    }

    if (data.type === 'SUBMIT_TOPIC') {
      broadcast({
        type: 'STATE_UPDATE',
        payload: {
          nextState: "discussing",
          data: {
            topic: data.payload.topic,
            selected_emojis: data.payload.emojis,
            assignments: [
              { user_id: "aa", emoji: "🍎" },
              { user_id: "bb", emoji: "🍎" },
              { user_id: "dummy1", emoji: "👨" },
              { user_id: "dummy2", emoji: "🏢" }
            ]
          }
        }
      });

      if (timerInterval) clearInterval(timerInterval);
      let seconds = 10; 
      timerInterval = setInterval(() => {
        seconds--;
        if (seconds < 0) {
          clearInterval(timerInterval!);
          broadcast({ type: 'STATE_UPDATE', payload: { nextState: "answering" } });
          return;
        }
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        broadcast({ type: 'TIMER_TICK', payload: { time: `${min}:${sec}` } });
      }, 1000);
    }
  });

  client.addEventListener('close', () => {
    allClients.delete(client);
    if (allClients.size === 0 && timerInterval) clearInterval(timerInterval);
  });
});

export const handlers = [
  // --- 1. Room関連 (HTTP) ---
  http.post('/api/rooms', async () => {
  console.log("MSW: Intercepted /api/rooms!");
  const hostUser = { user_id: "aa", user_name: "ホスト(あなた)", role: "host", is_Leader: true };
  // ルーム作成時はリストをリセット（テストしやすくするため）
  currentParticipants = [
    hostUser,
    { user_id: "dummy1", user_name: "たいよう", role: "player", is_Leader: false },
    { user_id: "dummy2", user_name: "しょう", role: "player", is_Leader: false },
  ];
  await delay(500);
 await delay(500);
  return HttpResponse.json({
    "room_id": "abc",
    "user_id": "aa", // これが context の myUserId になる
    "room_code": "AAAAAA",
  }, { status: 201 });
}),

http.post('/api/user', async ({ request }) => {
  const body = await request.json() as any;
  const newUserId = "bb-" + Math.random().toString(36).substring(2, 7);

  // 🔴 参加者をリストに追加
  currentParticipants.push({
    user_id: newUserId,
    user_name: body.user_name || "ゲスト",
    role: "player",
    is_Leader: false, // 参加者はリーダーではない
  });

  return HttpResponse.json({
    "room_id": "abc",
    "user_id": newUserId,
    "is_leader": "false", // 設計書の string 型に合わせる
  }, { status: 200 });
}),

http.post('/api/rooms/:room_id/start', async ({ params }) => {
  // どの部屋のIDでリクエストが来たかログに出す
  console.log(`[MSW] Intercepted startGame for room: ${params.room_id}`);
  await delay(200);
  return HttpResponse.json({ status: "success" }, { status: 200 });
}),

http.post('/api/rooms/:room_id/topic', async ({ params }) => {
    console.log(`[MSW] Intercepted submitTopic for room: ${params.room_id}`);
    await delay(300);
    return HttpResponse.json({ status: "success" }, { status: 200 });
  }),

  http.post('/api/rooms/:room_id/finish', async ({ params }) => {
    console.log(`[MSW] Intercepted finishRoom for room: ${params.room_id}`);
    await delay(200);
    return HttpResponse.json({ status: "success" }, { status: 200 });
  }),

  // --- 2. WebSocketのモック (gameWs.addEventListener をそのまま入れる) ---
  gameWs.addEventListener('connection', ({ client }) => {
    allClients.add(client);
    console.log("[MSW] New Connection. Total:", allClients.size);

    // 🔴 誰かが入室（接続）したら、即座に最新のリストを全員（ホスト含む）に送る
    setTimeout(() => {
      broadcastParticipants();
    }, 500);

    client.addEventListener('message', (event) => {
      // 🔴 受信自体ができているかログを出す
      console.log("[MSW] Received message from client:", event.data);
      
      const data = JSON.parse(event.data as string);
      if (data.type === 'FETCH_PARTICIPANTS') {
        console.log("[MSW] Manual fetch requested");
        broadcastParticipants();
      }

      if (data.type === 'WAITING') {
        broadcast({
          type: 'STATE_UPDATE',
          payload: { nextState: "setting_topic" }
        });
        return;
      }

      if (data.type === 'CHECKING') {
        broadcast({
          type: 'STATE_UPDATE',
          payload: { nextState: "finished" }
        });
        return;
      }

      if (data.type === 'ANSWERING') {
        broadcast({
          type: 'STATE_UPDATE',
          payload: {
            nextState: "checking",
            data: { answer: data.payload.answer }
          }
        });
        return;
      }

      if (data.type === 'SUBMIT_TOPIC') {
        broadcast({
          type: 'STATE_UPDATE',
          payload: {
            nextState: "discussing",
            data: {
              topic: data.payload.topic,
              selected_emojis: data.payload.emojis,
              assignments: [
                { user_id: "aa", emoji: "🍎" },
                { user_id: "bb", emoji: "🍎" },
                { user_id: "dummy1", emoji: "👨" },
                { user_id: "dummy2", emoji: "🏢" }
              ]
            }
          }
        });

        if (timerInterval) clearInterval(timerInterval);
        let seconds = 10; 
        timerInterval = setInterval(() => {
          seconds--;
          if (seconds < 0) {
            clearInterval(timerInterval!);
            broadcast({ type: 'STATE_UPDATE', payload: { nextState: "answering" } });
            return;
          }
          const min = Math.floor(seconds / 60).toString().padStart(2, '0');
          const sec = (seconds % 60).toString().padStart(2, '0');
          broadcast({ type: 'TIMER_TICK', payload: { time: `${min}:${sec}` } });
        }, 1000);
      }
    });

    client.addEventListener('close', () => {
      allClients.delete(client);
      if (allClients.size === 0 && timerInterval) clearInterval(timerInterval);
    });
  }),
];