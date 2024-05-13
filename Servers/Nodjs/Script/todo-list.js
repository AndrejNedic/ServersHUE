import {HttpClient} from "./server-client.js";
let list;
let addItem;
function init() {
    const listDiv = $("#itemList");
  const input = $("#todo");
    const addBtn = $("#addBtn");
    const progress = $("#progress");
    if (!listDiv || !input || !addBtn) {
        alert("invalid HTML");
        return;
    }
    addItem = new AddItem(input, progress);
    list = new ListDisplay(listDiv);
    list.loadItems().then(_ => {
  addBtn.on("click", () => {
      addItem.addNewItem(list);
  });
        alert("initial setup complete");
    });
}
$(function() {
  init();
});
class ListDisplay {
    constructor(contentDiv) {
        this.items = [];
  this.div = contentDiv;
  this.client = new HttpClient();
    }
    async loadItems() {
  this.items = await this.client.getAllToDoItems();
        this.renderItems();
    }
    renderItems() {
        function renderItem(item) {
  let html = "<li>";
  html += item.text;
            html += "</li>";
            return html;
        }
        let html = "<ul>";
        for (let item of this.items) {
            html += renderItem(item);
        }
        html += "</ul>";
  this.div.html(html);
    }
}
class AddItem {
    constructor(textBox, progress) {
        this.textBox = textBox;
        this.progressBar = progress;
        this.client = new HttpClient();
        this.addInProgress = false;
        this.toggleProgressBar(false, 0);
    }
    addNewItem(list) {
        if (this.addInProgress) {
  return;
        }
        const text = this.text;
        if (!AddItem.validateText(text)) {
            alert("invalid todo text");
            return;
        }
        this.toggleProgressBar(true);
  this.addInProgress = true;
  this.client.addNewItem(text, () => {
  setTimeout(async () => {
  await list.loadItems();
      this.addInProgress = false;
  this.toggleProgressBar(false);
  this.textBox.val("");
  }, 1500);
  });
    }
    toggleProgressBar(enabled, duration = 200) {
  if (enabled) {
      this.progressBar.show(duration);
      return;
  }
        this.progressBar.hide(duration);
        10
    }
    get text() {
  return this.textBox.val();
    }
    static validateText(str) {
  function isNullOrEmptyString(stringVal) {
      function isNullOrUndefined(val) {
          return val === null || val === undefined || typeof val == "undefined";
      }
      stringVal = $.trim(stringVal);
      return isNullOrUndefined(stringVal) || stringVal === "";
  }
        function isWhitespaceString(stringVal) {
            return !/\S/.test(stringVal);
        }
        if (isNullOrEmptyString(str) || str === " ") {
            return false;
        }
        return !isWhitespaceString(str);
    }
}
