/**
 *
 * ***********************
 *
 * 通用的封装方法
 *
 */
const utils = {
  /**
   * arrayToObject
   * @param {*} list item[]
   * @param {*} key string
   * @description 根据数据里面的某一个key对应的值，将数组转换为对象
   * @returns object
   * {
   *  [value: index]: item
   * }
   */
  arrayToObject(list, key) {
    if (!Array.isArray(list) || !key) {
      return {};
    }
    return list.reduce((acc, item) => {
      const value = item[key];
      acc[value] = item;
      return acc;
    }, {});
  },
  /**
   * filterArrayWithKey
   * @param {*} list1 item[]
   * @param {*} key1 string
   * @param {*} list2 item[]
   * @param {*} key2 string
   * @description 找出 list1列表中 item[key1] 不存在于 list2 的项
   */
  filterArrayWithKey(list1, key1, list2, key2) {
    const list2Map = utils.arrayToObject(list2, key2);
    return list1.filter((item) => {
      if (list2Map[item[key1]] !== undefined) {
        return false;
      }
      list2Map[item[key1]] = item;
      return true;
    });
  },
};

/**
 *
 * **********************
 *
 * dialog组件
 * @description
 * 1、支持open、close
 * 2、支持
 */
function Dialog(props) {
  this.props = this.extend(this.defaults, props || {});
}
/**
 * @description
 * defaults
 * 默认的参数配置
 */
Dialog.prototype.defaults = {
  title: 'DataHub数据自动化录入',
  textMode: {
    default: 'default',
    title: 'title',
    desc: 'desc',
    info: 'info',
    error: 'error',
  },
  cssName: {
    root: 'datahub-modal-root',
    header: 'datahub-modal-header',
    close: 'datahub-modal-close',
    content: 'datahub-modal-content',
    contentItems: 'datahub-modal-content-list',
    footer: 'datahub-modal-footer',
    loading: 'footer-loading',
    ok: 'datahub-modal-ok',
  },
};
/**
 * extend
 * @param {*} defaults defaults
 * @param {*} props props
 * @description 合并参数
 */
Dialog.prototype.extend = function (defaults, props) {
  for (const prop in props) {
    if (props.hasOwnProperty(prop)) {
      defaults[prop] = src[prop];
    }
  }
  return defaults;
};
/**
 * template
 * @description
 * Dialog的html模板
 */
Dialog.prototype.template = function () {
  const { title, cssName } = this.props;
  const { root, header, close, content, footer, ok, contentItems, loading } = cssName;

  const titleEle = `<div class="${header}">${title}<div class="${close}">×</div></div>`;
  const contentEle = `<div class="${content}"><ul class="${contentItems}"></ul></div>`;
  const footerEle = `<div class="${footer}">
    <div class="${loading}">
      <svg t="1625125118797" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1970" width="20" height="20"><path d="M563.2 819.2a102.4 102.4 0 1 1 0 204.8 102.4 102.4 0 0 1 0-204.8z m-320.4608-153.6a128 128 0 1 1 0 256 128 128 0 0 1 0-256z m592.7936 25.6a102.4 102.4 0 1 1 0 204.8 102.4 102.4 0 0 1 0-204.8zM947.2 477.1328a76.8 76.8 0 1 1 0 153.6 76.8 76.8 0 0 1 0-153.6zM128 307.2a128 128 0 1 1 0 256 128 128 0 0 1 0-256z m782.6432-40.6016a51.2 51.2 0 1 1 0 102.4 51.2 51.2 0 0 1 0-102.4zM409.6 0a153.6 153.6 0 1 1 0 307.2 153.6 153.6 0 0 1 0-307.2z m384 153.6a25.6 25.6 0 1 1 0 51.2 25.6 25.6 0 0 1 0-51.2z" fill="#555555" p-id="1971"></path></svg>
      数据录入中...</div>
    <button class="btn btn-primary ${ok}">确定</button>
  </div>`;

  const _rootEle = document.createElement('div');
  _rootEle.setAttribute('class', root);
  _rootEle.innerHTML = `
    <div class='datahub-modal-mask'></div>
    <div class='datahub-modal-wrap'>
      ${titleEle}
      ${contentEle}
      ${footerEle}
    </div>
    `;
  return _rootEle;
};
/**
 * open
 * @description
 * 打开弹窗
 */
Dialog.prototype.open = function () {
  const { root, contentItems } = this.props.cssName;
  document.querySelector(`.${contentItems}`).innerHTML = '';
  document.querySelector(`.${root}`).style.display = 'block';
};
/**
 * close
 * @description
 * 关闭弹窗
 */
Dialog.prototype.close = function () {
  const { root } = this.props.cssName;
  document.querySelector(`.${root}`).style.display = 'none';
};
/**
 * bindEvents
 * @description
 * 绑定点击事件
 */
Dialog.prototype.bindEvents = function () {
  const { close, ok } = this.props.cssName;
  document.querySelector(`.${close}`).onclick = (e) => {
    e.preventDefault();
    this.close();
  };
  document.querySelector(`.${ok}`).onclick = (e) => {
    e.preventDefault();
    this.close();
  };
};
/**
 * init
 * @description
 * 初始化
 */
Dialog.prototype.init = function () {
  const layout = this.template();
  document.body.appendChild(layout);
  this.bindEvents();
};
/**
 * addText
 * @param {*} msg string
 * @param {*} type string 文本的类型 default、info、error 3种
 * @description
 * 操作记录，将日志添加到html中显示出来
 */
Dialog.prototype.addText = function (msg, type) {
  const { contentItems, content } = this.props.cssName;
  const el = document.createElement('li');
  el.innerHTML = msg;
  el.setAttribute('class', `text-item ${type || 'default'}`);
  document.querySelector(`.${contentItems}`).appendChild(el);
  /**
   * @description
   * 判断滚动条的位置，始终保持滚动条的位置在最下方
   */
  const contentEl = document.querySelector(`.${content}`);
  const { scrollHeight, offsetHeight } = contentEl;
  if (scrollHeight > offsetHeight) {
    contentEl.scrollTop = scrollHeight - offsetHeight;
  }
};
/**
 * addTextLine
 * @param {*} msg string
 * @param {*} type string 文本的类型 default、info、error 3种
 * @description
 * 添加空行 ----------------------------- 分隔
 */
Dialog.prototype.addTextLine = function (msg, type) {
  const { contentItems, content } = this.props.cssName;
  const el = document.createElement('li');
  el.innerHTML = `---------------${msg}--------------`;
  el.setAttribute('class', `text-item ${type || 'default'}`);
  document.querySelector(`.${contentItems}`).appendChild(el);
  /**
   * @description
   * 判断滚动条的位置，始终保持滚动条的位置在最下方
   */
  const contentEl = document.querySelector(`.${content}`);
  const { scrollHeight, offsetHeight } = contentEl;
  if (scrollHeight > offsetHeight) {
    contentEl.scrollTop = scrollHeight - offsetHeight;
  }
};
/**
 * loading
 * @description
 * 显示loading态
 */
Dialog.prototype.loading = function (flag) {
  const { footer, loading, ok } = this.props.cssName;
  document.querySelector(`.${footer} .${loading}`).style.display = flag
    ? 'flex'
    : 'none';
  document.querySelector(`.${footer} .${ok}`).style.display = flag
    ? 'none'
    : 'block';
};

/**
 *
 * *******************
 *
 * logTraceId 应该是datahub平台日志记录id，先随便用一个
 *
 */
const logTraceId = '';

/**
 *
 * *******************
 *
 * dadahubApi
 * @description
 * dadahub平台api接口封装
 *
 */
const dadahubApi = {
  request(url, data) {
    const headers = {
      'content-type': 'application/json',
    };
    data.method = data.method || 'GET';
    data.headers = {
      ...data.headers,
      ...headers,
    };
    return new Promise((resolve, reject) => {
      fetch(url, data)
        .then(async function (response) {
          try {
            const json = await response.json();
            const { status, result } = json;
            if (status?.code === '1') {
              resolve(result);
            } else {
              reject(new Error(status.message));
            }
          } catch (error) {
            reject(error);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  get(url) {
    return this.request(url, { method: 'GET' });
  },
  post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  /**
   * 根据chainId获取详情信息
   * @param {*} chainId string
   */
  getDetailByChainId(chainId) {
    return this.get(
      `http://datahub.tencent.com/api/link/getDetailByChainId?log_trace_id=${logTraceId}&chainId=${chainId}`,
    );
  },
  /**
   * 根据accessId获取access详情信息
   * @param {*} accessId string
   */
  getAccessByAccessId(accessId) {
    return this.get(
      `http://datahub.tencent.com/api/link/access?log_trace_id=${logTraceId}&id=${accessId}`,
    );
  },
  /**
   *
   * @param {*} chainId string
   * @param {*} accessId string
   * @description 获取公参字段列表
   * @returns object[]
   * @returns create_time  "2021-06-30 17:25:39"
   * @returns create_user "milohuang"
   * @returns data_access_id  1085544
   * @returns field_index 59
   * @returns field_key  "current_level"
   * @returns field_type  1
   * @returns id  3811042
   * @returns state 1
   * @returns update_time "2021-06-30 17:25:39"
   * @returns update_user "milohuang"
   *
   */
  async getEtlSourceFields(chainId, accessId) {
    const res = await this.get(
      `http://datahub.tencent.com/api/assets/source/fields?source_id=${accessId}&chainId=${chainId}&offset=0&limit=10000&log_trace_id=${logTraceId}`,
    );
    return res.records;
  },
  /**
   *
   * @param {*} chainId string
   * @description 获取事件管理列表
   *
   */
  async getSinkFields(chainId) {
    const res = await this.get(
      `http://datahub.tencent.com/api/sink/fields?log_trace_id=${logTraceId}&keyword=&dataAccessId=&chainId=${chainId}&limit=10000&offset=0`,
    );
    return res.records;
  },
  /**
   * getPreloadSinkFields
   * @description 获取sink全部的字段列表
   *
   * @param {*} data object
   * @param {*} data.sources obecjt[]
   * @param {*} data.sources.data_access_id number data_access_id
   * @param {*} data.sources.etl_task_id number etl_task_id
   *
   * @returns object[] array
   * @returns id?: number 字段的入库id，不一定存在
   * @returns field_index: number 字段的序号
   * @returns field_key: string 字段key
   * @returns field_name: string 字段名
   * @returns field_type: number 字段类型
   */
  async getPreloadSinkFields(data) {
    const res = await this.post(
      `http://datahub.tencent.com/api/sink/fields/preload?log_trace_id=${logTraceId}`,
      data,
    );
    return res;
  },
  /**
   * getSink
   * @description
   * 获取sink信息
   *
   */
  getSink(id) {
    return this.get(
      `http://datahub.tencent.com/api/sink?log_trace_id=${logTraceId}&id=${id}`,
    );
  },
  /**
   * saveSink
   * @param {*} data
   * @description 修改sink信息
   */
  saveSink(data) {
    return this.put(
      `http://datahub.tencent.com/api/sink?log_trace_id=${logTraceId}`,
      data,
    );
  },
  /**
   *
   * @param {*} etlTaskId ETL组件id
   * @param {*} items item[] 新增的参数列表
   * @param {*} item.event_codes string， 固定值e1
   * @param {*} item.isNew: true 固定值true
   * @param {*} item.opt_expr: 参数名
   * @param {*} item.opt_type: 类型 固定值3
   * @param {*} item.source_field_keys: action_kvp 固定值action_kvp
   * @param {*} item.target_field_keys: 目标字段
   * @param {*} item.target_field_type: 字段类型
   * @description ETL组件-解析json组件: 新增数据上报
   */
  etlTaskSubmit(etlTaskId, items) {
    const data = {
      etlTaskId,
      items,
    };
    return this.post(
      `http://datahub.tencent.com/api/etl/task/taskItem?log_trace_id=${logTraceId}`,
      data,
    );
  },
  /**
   * @description
   * 接入源-ATTA组件-参数配置页面
   * 修改字段列表
   */
  attaAccessSubmit(data) {
    return this.put(
      `http://datahub.tencent.com/api/link/access??log_trace_id=${logTraceId}`,
      data,
    );
  },
};

/**
 *
 * *******************
 *
 * @description
 * content js 逻辑处理
 * 1、接收插件消息&数据
 * 2、模拟请求保存数据
 *
 */
function Content(props) {
  const { dialog } = props;
  this.id = 'content';
  this.data = {};
  this.dialog = dialog;
  /**
   * @description
   * 事件字段的类型
   */
  this.targetFieldType = {
    string: 1,
    bigint: 2,
    double: 3,
  };
  /**
   * excel中的数据字段
   */
  this.excelfields = {
    eventCode: 'action*',
    eventName: '事件显示名*',
    optExpr: 'action kvp*',
    fieldKey: 'action kvp*',
    fieldType: 'action_kvp value数据类型*',
  };
}
Content.prototype.log = function (...args) {
  console.log('[Chrome Content Log]', ...args);
};
/**
 *
 * @description
 * 初始化location url的参数, 并存储到data中
 *
 */
Content.prototype.initUrlQuery = function () {
  const { search } = location;
  const query = {};
  search
    .replace('?', '')
    .split('&')
    .forEach((item) => {
      const [key, value] = item.split('=');
      query[key] = value;
    });
  this.data = {
    ...this.data,
    ...query,
  };
  this.log('初始化参数', this.data);
};
/**
 *
 * @description
 * 发送消息给popup窗口
 *
 */
Content.prototype.sendMessageToPopup = function (message, callback) {
  chrome.runtime.sendMessage(
    {
      id: this.id,
      ...message,
    },
    (res) => {
      if (typeof callback === 'function') {
        callback(res);
      }
    },
  );
};
Content.prototype.init = function () {
  this.log('Content App Init');
  this.initUrlQuery();
  this.initOnMessageHandler();
  this.dialog.init();
};
/**
 * @description
 * 转换数据的字段格式，保持和datahub数据格式一致
 * 表格数据字段:  "action*", "事件显示名*", "action kvp*", "参数显示名*", "action_kvp value数据类型*"
 */
Content.prototype.transfromDataFields = function (data) {
  const resultList = [];
  data.forEach((item) => {
    const fieldObj = Object.keys(this.excelfields).reduce((acc, key) => {
      let value = item[this.excelfields[key]];
      // 参数的key需要转成小写
      if (key === 'fieldKey') {
        value = value && value.toLocaleLowerCase();
      }
      acc[key] = value;
      return acc;
    }, {});
    if (fieldObj.fieldKey && fieldObj.fieldType) {
      resultList.push(fieldObj);
    }
  });
  return resultList;
};
/**
 * ETL组件-解析JSON组件-参数配置页面
 * @param {*} dataEtlTask
 * @param {*} excelDataList 表格数据
 * @description
 *  1、将 etlTaskItemList 和导入数据做比较，筛选出新的参数列表
 *  2、上报数据到datahub
 *
 * @todo 如果fieldKey在公参中出现，需要过滤掉
 *
 */
Content.prototype.etlComponentSubmit = async function (
  dataEtlTask,
  excelDataList,
) {
  this.dialog.addText('ETL组件', 'title');
  this.dialog.addText(`ETL组件-解析JSON页面数据正在解析中...`);
  /**
   * etlTaskId: etl插件的id
   * etlTaskItemList: 已经录入的字段信息列表
   */
  const { etlTaskId } = dataEtlTask;
  const etlTaskItemList = (dataEtlTask.etlTaskItemList || []).map((item) => {
    const value = item.target_field_keys;
    // 转换成小写
    item.target_field_keys = value && value.toLocaleLowerCase();
    return item;
  });
  this.log('etlTaskItemList', etlTaskItemList);
  /**
   * @description
   * 将 excelDataList 和 etlTaskItemList 做比较
   * 得到需要添加的时间
   */
  const etlTaskFieldMap = utils.arrayToObject(
    etlTaskItemList,
    'target_field_keys',
  );
  const newDataList = excelDataList
    .filter((item) => {
      if (!etlTaskFieldMap[item.fieldKey]) {
        etlTaskFieldMap[item.fieldKey] = item;
        return true;
      }
      return false;
    })
    .map((item) => {
      const { optExpr, fieldKey, fieldType } = item;
      return {
        event_codes: 'e1',
        isNew: true,
        opt_expr: optExpr,
        opt_type: 3,
        source_field_keys: 'action_kvp',
        target_field_keys: fieldKey,
        target_field_type: this.targetFieldType[fieldType],
      };
    });
  this.log('新添加的数据列表：', newDataList);
  if (newDataList.length === 0) {
    this.dialog.addText(`无需更新：ETL组件-解析JSON页面数据无需更新`);
    return;
  }
  this.dialog.addText(`上传${newDataList.length}条数据中...`);
  const res = await dadahubApi.etlTaskSubmit(etlTaskId, newDataList);
  this.dialog.addText(`ETL组件-解析JSON页面-参数上传成功`);
  this.log('添加数据成功', res);
};
/**
 * @description
 * 接入源-ATTA组件-参数配置页面
 * @param {*} chainId
 * @param {*} accessId
 * @description
 *  1、通过accessId获取access详情
 *  1、先获取字段列表
 *  2、筛选出新参数列表
 */
Content.prototype.attaComponentSubmit = async function (
  chainId,
  accessId,
  busiId,
  excelDataList,
) {
  this.dialog.addText('ATTA组件', 'title');
  this.dialog.addText(`接入源-ATTA组件,参数页面数据正在解析中...`);
  this.dialog.addText(`正在获取Access信息...`);
  const access = await dadahubApi.getAccessByAccessId(accessId);
  this.dialog.addText(`正在获取已有字段列表...`);
  const records = await dadahubApi.getEtlSourceFields(chainId, accessId);
  this.log('接入源-ATTA组件, 已有字段数据', records);
  /**
   * 记录字段的field_index, 取最大值
   */
  const newFieldList = [...records];
  let maxIndex = 0;
  const recordMap = records.reduce((acc, item) => {
    /**
     * 获取当前已存在的field_index，取最大值
     */
    maxIndex = Math.max(maxIndex, item.field_index);
    /**
     * 记录field_key
     */
    acc[item.field_key] = item;
    return acc;
  }, {});
  excelDataList.forEach((item) => {
    const { fieldKey, fieldType } = item;
    if (!recordMap[fieldKey]) {
      recordMap[fieldKey] = item;
      /**
       * maxIndex +1
       */
      maxIndex += 1;
      /**
       * 将新的字段添加到队列中
       */
      newFieldList.unshift({
        field_index: maxIndex,
        field_key: fieldKey,
        field_type: this.targetFieldType[fieldType],
      });
    }
  });
  this.log('newFieldList', maxIndex, newFieldList);
  if (newFieldList.length === records.length) {
    this.dialog.addText('无需更新：接入源-ATTA组件, 参数页面数据无需更新');
    return;
  }
  this.dialog.addText(
    `正在上传新增字段列表, 共${newFieldList.length - records.length}条`,
  );
  const newData = {
    cid: '',
    tdbankid: '',
    ...access,
    fields: newFieldList,
    chain_id: chainId,
    busi_id: busiId,
  };
  await dadahubApi.attaAccessSubmit(newData);
  this.dialog.addText('接入源-ATTA组件,参数页面数据上传成功');
  this.log('newData', newData);
};

/**
 * 目的地-入库灯塔组件提交
 * @param {*} sinkId number
 * @description
 * 1、通过sinkId获取sink信息
 *  {
 *    id: '',
 *    fields: [],
 *  }
 * 2、获取预加载的字段列表 preloadFields field[]
 * {
 *   field_key: "country"
 *   field_name: "国家"
 *   field_type: 1
 *   id: 1472316
 *  }
 * 3、preloadFields对比sink.fields，通过field_key字段将field信息添加到sink.fields
 * 4、提交sink信息保存
 */
Content.prototype.sinkComponentSubmit = async function (
  sinkId,
  busiId,
  sources,
) {
  this.dialog.addText('入库灯塔', 'title');
  this.dialog.addText('获取sink信息');
  const sink = await dadahubApi.getSink(sinkId);
  this.dialog.addText('获取PreloadSinkFields');
  const preloadFields = await dadahubApi.getPreloadSinkFields(sources);

  // 记录field_key
  const newFieldList = [...sink.fields];
  const recordMap = utils.arrayToObject(newFieldList, 'field_key');

  // 添加未勾选的项
  preloadFields.forEach((field) => {
    const { field_key } = field;
    if (!recordMap[field_key]) {
      recordMap[field_key] = field;
      // this.dialog.addText(`${field_key}`, 'desc');
      newFieldList.push(field);
    }
  });

  // 判断是否存在新加项
  const num = newFieldList.length - sink.fields.length;
  this.dialog.addText(`共勾选数据 ${num} 条`);
  if (num === 0) {
    this.dialog.addText(`无需更新：sink数据没有新加勾选项`);
    return;
  }

  this.dialog.addText(`正在上报数据`);
  const data = {
    busi_id: busiId,
    ...sink,
    fields: newFieldList,
  };
  await dadahubApi.saveSink(data);
  this.log('数据', data);
};

/**
 * 公共事件管理
 * @description
 * 1、获取公参列表
 * 2、获取事件列表
 * 3、事件列表 vs 导入事件列表 ==> 得到需要新增的事件列表
 * 4、录入新增事件+公参
 *  事件1 + 公参1
 *  事件2 + 公参2
 */
Content.prototype.commonEventsSubmit = async function (
  chainId,
  accessId,
  excelFieldList,
) {
  //
  const commonRecords = await dadahubApi.getEtlSourceFields(chainId, accessId);
  const eventList = await dadahubApi.getSinkFields(chainId);

  const eventListMap = utils.arrayToObject(eventList, 'event_code');
  const commonRecordsMap = utils.arrayToObject(commonRecords, 'fieldKey');

  // 筛选出需要新增的事件
  newEventList = excelFieldList.filter((item) => {
    return !eventListMap[item.eventCode];
  });

  console.log('-----commonRecords:', commonRecords);
  console.log('-----eventList:', eventList);
  console.log('-----newEventList:', newEventList);

  const newEventCodeMap = utils.arrayToObject(newEventList, 'eventCode');
  const newEventListMap = newEventList.reduce((acc, item) => {
    const key = `$${item.eventCode}$${item.fieldKey}`;
    acc[key] = item;
    return acc;
  }, {});
  /**
   * @todo 将每一项eventcode的参数都加上公参
   */
};
/**
 *
 * @param {*} data array
 * @description 提交数据
 * 1、修改ETL组件字段列表
 * 2、修改接入源-ATTA组件字段列表
 */
Content.prototype.submit = async function (datas) {
  const { chain_id: chainId } = this.data;
  if (!chainId) {
    alert('请先打开链路配置页面');
    return;
  }
  this.dialog.open();
  this.dialog.loading(true);
  this.dialog.addText(`Start`, 'title');
  this.dialog.addText(`开始解析数据`);
  /**
   * @description
   * 将表格数据转换一下
   * excelFieldList: 事件列表
   * excelCommonParamsList: 公参列表
   */
  const excelFieldList = this.transfromDataFields(datas[0].data);
  const excelCommonParamsList = this.transfromDataFields(datas[1].data);
  this.log('转换后的数据, ', excelFieldList, excelCommonParamsList);
  this.dialog.addText(
    `Excel数据：事件数据${excelFieldList.length}条, 公参数据${excelCommonParamsList.length}条`,
  );
  /**
   * @description
   * 先通过chainId获取链路详情信息，拿到ETL组件下的 "dataAccess", "dataEtlTask" 信息
   *
   * @description 字段解释
   * detailTemplateVOList: 链路配置列表
   * dataAccess: "接入源"的信息
   * dataEtlTask: "ETL组件"的信息
   *
   */
  this.dialog.addText(`获取DataHub平台chainInfo信息...`);
  try {
    const chainInfo = await dadahubApi.getDetailByChainId(chainId);
    this.dialog.addText(`获取DataHub平台chainInfo信息成功`);
    this.log('chainInfo', chainInfo);
    const { busiId, dataSinkList, detailTemplateVOList } = chainInfo;
    const { dataAccess, dataEtlTask } = detailTemplateVOList[0];
    const accessId = dataAccess.id;
    const fieldsExcludeCommonFileds = utils.filterArrayWithKey(
      excelFieldList,
      'fieldKey',
      excelCommonParamsList,
      'fieldKey',
    );
    await this.etlComponentSubmit(dataEtlTask, fieldsExcludeCommonFileds);
    await this.attaComponentSubmit(
      chainId,
      accessId,
      busiId,
      excelCommonParamsList,
    );
    // await this.sinkComponentSubmit(dataSinkList[0].id, busiId, {
    //   sources: [
    //     { data_access_id: accessId, etl_task_id: dataEtlTask.etlTaskId },
    //   ],
    // });
    // await this.commonEventsSubmit(chainId, accessId, excelFieldList);
    this.dialog.addText(`End`, 'title');
    this.dialog.addText(`数据自动录入操作完成，刷新页面可查看最新数据`, 'info');
  } catch (error) {
    this.log('submit, error:', error);
    this.dialog.addText(`数据录入失败了，error:${error.message}`, 'error');
  }
  this.dialog.loading(false);
};
/**
 * @description
 * 监听onMessage事件
 * 主要接收插件的消息和数据
 * id: 消息的来源, ”popup“: 插件
 * type: 消息的类型 ，比如：'submit' 提交事件数据
 * data: 接收到的数据
 */
Content.prototype.initOnMessageHandler = function () {
  chrome.runtime.onMessage.addListener((event, _sender, sendResponse) => {
    const { data, type, id } = event;
    this.log('收到信息', id, type, data);
    switch (type) {
      case 'submit':
        this.submit(data);
        break;
      default:
    }
    sendResponse({ status: 200, msg: 'success' });
  });
};

window.onload = function () {
  const dialog = new Dialog();
  const content = new Content({
    dialog,
  });
  content.init();
};
