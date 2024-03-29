var csvData = ""; // 外部ファイルからのデータ取得時に格納する変数

var currentSelectedItem = null; // 現在選択されたアイテムを追跡

function loadCSVData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data.csv", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            csvData = xhr.responseText;
            initializeTable();
        }
    };
    xhr.send();
}

function initializeTable() {
    var supportMethods = document.getElementById('support-methods');
    supportMethods.innerHTML = '';
    var lines = csvData.split('\n');

    for (var i = 0; i < lines.length; i++) {
        var row = lines[i].split(',');
        if (row.length >= 14) { // 14列以上が存在することを確認
            var method = row[0];
            var tags = row[1];
            var citation = row[2]; // col3を引用元として取得

            var li = document.createElement('li');
            li.innerHTML = method + " #" + tags; // タグを表示

            // 詳細情報を1つずつ改行で表示
            var details = row.slice(3, 14).map(function (detail) {
                return escapeHTML(detail);
            }).join("<br>");

            li.setAttribute('data-details', details);
            li.setAttribute('data-citation', citation);
            supportMethods.appendChild(li);
        }
    }

    document.getElementById('search-results').style.display = 'block';

    var items = document.querySelectorAll('#support-methods li');
    items.forEach(function (item) {
        item.addEventListener('click', function () {
            if (currentSelectedItem) {
                currentSelectedItem.classList.remove('selected');
            }
            currentSelectedItem = item;
            item.classList.add('selected');
            showSupportDetail(item);
        });
    });
}

function escapeHTML(html) {
    var el = document.createElement('div');
    el.innerText = el.textContent = html;
    return el.innerHTML;
}

function searchSupportMethods() {
    var keyword = document.getElementById('search-bar').value.toLowerCase();
    var items = document.querySelectorAll('#support-methods li');

    items.forEach(function (item) {
        var tags = item.textContent.toLowerCase();
        if (tags.includes(keyword)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function showSupportDetail(item) {
    var details = item.getAttribute('data-details');
    var citation = item.getAttribute('data-citation');
    var detailContent = document.getElementById('detail-content');
    var citationContent = document.getElementById('citation');
    var citationFooter = document.getElementById('citation-footer');
    
    detailContent.innerHTML = details; // 詳細情報を表示
    citationContent.innerHTML = "引用元: " + citation; // 引用元を表示
    detailContent.style.display = 'block';
}

loadCSVData();
