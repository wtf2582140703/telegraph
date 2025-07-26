document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const selectBtn = document.getElementById('select-btn');
    const resultContainer = document.getElementById('result-container');
    const imagePreview = document.getElementById('image-preview');
    const imageUrl = document.getElementById('image-url');
    const markdownUrl = document.getElementById('markdown-url');
    const loading = document.getElementById('loading');
    const newUploadBtn = document.getElementById('new-upload');
    const adminLink = document.getElementById('admin-link');
    
    // 初始化Clipboard.js
    new ClipboardJS('.copy-btn');
    
    // 设置管理链接
    const host = window.location.host;
    adminLink.href = `https://${host}/admin`;
    
    // 处理按钮点击
    selectBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 处理文件选择
    fileInput.addEventListener('change', handleFiles);
    
    // 处理拖拽事件
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // 高亮拖拽区域
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add('drag-over');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove('drag-over');
        }, false);
    });
    
    // 处理文件拖放
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }
    
    // 处理文件上传
    function handleFiles(e) {
        const files = e.target.files;
        if (!files.length) return;
        
        const file = files[0];
        
        // 验证文件类型
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert(`错误：不支持的文件类型 ${file.type}`);
            return;
        }
        
        // 验证文件大小 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('错误：文件大小超过 5MB 限制');
            return;
        }
        
        // 显示加载状态
        dropArea.style.display = 'none';
        loading.style.display = 'block';
        
        // 显示预览
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="预览">`;
        };
        reader.readAsDataURL(file);
        
        // 上传文件
        uploadFile(file);
    }
    
    // 上传文件到服务器
    async function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`上传失败: ${response.statusText}`);
            }
            
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            
            // 显示结果
            showResult(data.url);
        } catch (error) {
            showError(error.message);
        } finally {
            loading.style.display = 'none';
        }
    }
    
    // 显示上传结果
    function showResult(url) {
        imageUrl.value = url;
        markdownUrl.value = `![图片描述](${url})`;
        resultContainer.style.display = 'block';
    }
    
    // 显示错误信息
    function showError(message) {
        dropArea.style.display = 'block';
        alert(message);
    }
    
    // 处理新上传按钮
    newUploadBtn.addEventListener('click', () => {
        resultContainer.style.display = 'none';
        dropArea.style.display = 'block';
        fileInput.value = '';
    });
});