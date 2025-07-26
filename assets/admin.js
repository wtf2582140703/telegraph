document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const deleteButtons = document.querySelectorAll('.action-btn.delete');
    const blockButtons = document.querySelectorAll('.action-btn.block');
    
    // 删除图片功能
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const filename = row.querySelector('td:nth-child(2)').textContent;
            
            if (confirm(`确定要删除 ${filename} 吗？此操作不可撤销。`)) {
                // 这里应该调用API执行删除操作
                // 实际项目中应替换为真实的API调用
                console.log(`删除图片: ${filename}`);
                
                // 从UI中移除该行
                row.remove();
                
                // 显示成功消息
                showNotification(`已删除: ${filename}`, 'success');
            }
        });
    });
    
    // 屏蔽图片功能
    blockButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const filename = row.querySelector('td:nth-child(2)').textContent;
            
            if (confirm(`确定要屏蔽 ${filename} 吗？该图片将不再显示。`)) {
                // 这里应该调用API执行屏蔽操作
                // 实际项目中应替换为真实的API调用
                console.log(`屏蔽图片: ${filename}`);
                
                // 添加屏蔽样式
                row.style.opacity = '0.6';
                row.style.backgroundColor = '#ffeef0';
                
                // 更新按钮状态
                this.textContent = '已屏蔽';
                this.disabled = true;
                
                // 显示成功消息
                showNotification(`已屏蔽: ${filename}`, 'warning');
            }
        });
    });
    
    // 显示通知消息
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 3秒后自动消失
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // 添加通知样式
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            opacity: 0;
            transform: translateY(-10px);
            animation: fadeIn 0.3s forwards;
        }
        
        .notification.success {
            background-color: #2ecc71;
        }
        
        .notification.warning {
            background-color: #f39c12;
        }
        
        .notification.error {
            background-color: #e74c3c;
        }
        
        @keyframes fadeIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});