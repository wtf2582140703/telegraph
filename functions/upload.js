export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const formData = await request.formData();
        const file = formData.get('file');
        
        if (!file) {
            return new Response(JSON.stringify({ error: '未接收到文件' }), {
                status: 400,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
        
        // 验证文件类型
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return new Response(JSON.stringify({ 
                error: `不支持的文件类型: ${file.type}`
            }), {
                status: 400,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
        
        // 验证文件大小 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return new Response(JSON.stringify({ 
                error: '文件大小超过5MB限制'
            }), {
                status: 400,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
        
        // 创建新的FormData对象
        const telegramForm = new FormData();
        telegramForm.append('chat_id', env.TG_CHAT_ID);
        telegramForm.append('photo', file);
        
        // 发送到Telegram API
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendPhoto`,
            {
                method: 'POST',
                body: telegramForm
            }
        );
        
        const result = await telegramResponse.json();
        
        if (!result.ok) {
            throw new Error(`Telegram API错误: ${result.description}`);
        }
        
        // 获取最高分辨率图片
        const photos = result.result.photo;
        const largestPhoto = photos[photos.length - 1];
        const fileId = largestPhoto.file_id;
        
        // 生成Telegraph URL
        const telegraphUrl = `https://telegra.ph/file/${fileId}.jpg`;
        
        return new Response(JSON.stringify({ url: telegraphUrl }), {
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ 
            error: error.message 
        }), { 
            status: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
