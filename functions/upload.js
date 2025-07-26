// functions/upload.js
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    
    // 创建新的 FormData
    const formData = await request.formData();
    const file = formData.get('file');
    
    // 验证文件
    if (!file || typeof file === 'string') {
      return new Response(JSON.stringify({
        error: '无效的文件输入',
        received: file ? typeof file : 'undefined'
      }), { status: 400 });
    }
    
    // 准备 Telegram API 请求
    const telegramForm = new FormData();
    telegramForm.append('chat_id', env.TG_CHAT_ID);
    
    // 关键修复：创建新 File 对象确保正确类型
    const cleanFile = new File(
      [file], 
      file.name || 'upload.jpg', 
      { type: file.type }
    );
    telegramForm.append('photo', cleanFile);
    
    // 发送到 Telegram
    const telegramUrl = `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendPhoto`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      body: telegramForm
    });
    
    // 获取并验证响应
    const result = await response.json();
    
    if (!result.ok) {
      // 返回完整错误给前端
      return new Response(JSON.stringify({
        error: 'Telegram API 错误',
        code: result.error_code,
        description: result.description,
        fullResponse: result
      }), { status: 500 });
    }
    
    // 提取图片ID
    const photo = result.result?.photo?.[2] || result.result?.photo?.[0];
    if (!photo || !photo.file_id) {
      return new Response(JSON.stringify({
        error: '无法获取图片ID',
        telegramResponse: result
      }), { status: 500 });
    }
    
    // 返回成功响应
    return new Response(JSON.stringify({
      success: true,
      url: `https://telegra.ph/file/${photo.file_id}.jpg`
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });
    
  } catch (error) {
    // 返回完整错误信息
    return new Response(JSON.stringify({
      error: '服务器内部错误',
      message: error.message,
      stack: error.stack
    }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });
  }
}
