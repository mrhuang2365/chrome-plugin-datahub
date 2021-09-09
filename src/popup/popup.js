function Popup() {
  this.id = 'popup';
  this.excelFileData = null;
}
Popup.prototype.log = function (...args) {
  console.log('[Chrome Popup Log]', ...args);
};
Popup.prototype.init = function () {
  this.log('Popup App Init');
  this.initOnMessageHandler();
  this.initInputEventHandler();
  // 上传文件按钮点击
  $('.upload-btn').click(() => {
    $('.file-input').click();
  });
  // 提交按钮点击
  $('.operation .submit').click(() => {
    if (!this.excelFileData) {
      alert('请先上传excel文件');
      return;
    }
    this.sendMessageToContent({
      type: 'submit',
      data: this.excelFileData,
    });
  });
};
/**
 *
 * @param {*} message string
 * @param {*} callback funtion
 * @description
 * 发送消息给content
 */
Popup.prototype.sendMessageToContent = function (message, callback) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      const { id, url } = tabs[0];
      if (!url.includes('datahub.tencent.com/edu/data_link/add_link')) {
        alert('请先打开DataHub平台链路配置页面');
        return;
      }
      chrome.tabs.sendMessage(id, { id: this.id, ...message }, (res) => {
        this.log('收到content的回信', res);
        if (res?.status !== 200) {
          alert('请先刷新页面');
          return;
        }
        if (typeof callback === 'function') {
          callback(res);
        }
      });
    },
  );
};
/**
 * @description
 * input文件上传逻辑处理
 */
Popup.prototype.initInputEventHandler = function () {
  $('.file-input').change(function () {
    if (!this.files) {
      return;
    }
    const file = this.files[0];
    $('.operation').show();
    $('.file-list').text(file.name);
    popup.excelFileData = null;
    popup
      .transfromExcelData(file)
      .then((res) => {
        popup.log('excel文件解析后获得的数据：', res);
        popup.excelFileData = res;
      })
      .catch((error) => {
        popup.log('error', error);
      });
  });
};
/**
 * @description
 * 监听onMessage
 */
Popup.prototype.transfromExcelData = function (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function (e) {
      const data = e.target.result;
      const excelFile = XLSX.read(data, {
        type: 'binary',
      });
      const datas = excelFile.SheetNames.map((sheetName) => {
        const headers = []; // 表头
        const data = XLSX.utils.sheet_to_json(excelFile.Sheets[sheetName]);
        for (const key in data[0]) {
          headers.push(key);
        }
        return {
          sheetName,
          headers,
          data,
        };
      });
      resolve(datas);
    };
    reader.onerror = (error) => {
      this.log('Reader Error:', error);
      reject(error);
    };
  });
};
/**
 * @description
 * 监听onMessage
 */
Popup.prototype.initOnMessageHandler = function () {
  chrome.runtime.onMessage.addListener((event, sender, sendResponse) => {
    console.log('接收了来自 content.js的消息', event);
    sendResponse({ status: 200, msg: 'success' });
  });
};

const popup = new Popup();
popup.init();
