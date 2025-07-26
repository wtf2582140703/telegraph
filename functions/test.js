export async function onRequest(context) {
  return new Response(JSON.stringify({
    env: {
      TG_BOT_TOKEN: context.env.TG_BOT_TOKEN ? "存在" : "未设置",
      TG_CHAT_ID: context.env.TG_CHAT_ID ? "存在" : "未设置"
    },
    time: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
