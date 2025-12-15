// ページの読み込みが完了してから実行
document.addEventListener("DOMContentLoaded", () => { // Documet(HTML) Object Modelの略 HTMLをオブジェクトのように扱う。
  const form = document.getElementById("postForm");
  const postList = document.getElementById("postList");
  const emptyMessage = document.getElementById("emptyMessage");

  let posts = []; // 投稿を格納する配列

  // 初期化：LocalStorageからデータを読み込む
  function loadPosts() {
    const savedData = localStorage.getItem("live_mate_posts"); // key値："live_mate_posts"
    if (savedData) {
      posts = JSON.parse(savedData);

      // 保存されたデータがあれば表示する
      if (posts.length > 0) {
        if (emptyMessage) {
          emptyMessage.remove();
        }
        // 配列は新しい順（[0]が最新）なので、順番にappendChildしていけばok
        // 今回はunshiftで追加しているので[0]が最新
        posts.forEach((post) => {
          const item = createPostElement(post);
          postList.appendChild(item);
        });
      }
    }
  }

  // 投稿データをLocalStorageに保存する
  function savePosts() {
    localStorage.setItem("live_mate_posts", JSON.stringify(posts)); // JSON文字列で保存
  }

  // 投稿のHTML要素を作成する関数
  function createPostElement(post) {
    const item = document.createElement("article");
    item.className = "post-card";

    // IDがない古いデータ対策
    if (!post.id) {
      post.id = Date.now() + Math.random(); // 重複しないように簡易ID
    }

    item.innerHTML = `
      <div class="post-header">
        <h3 class="post-title">${post.title}</h3>
        <button class="delete-btn" data-id="${post.id}">削除</button>
      </div>
      <p class="post-meta">${post.date} ｜ ${post.area}</p>
      <p class="post-note">${post.comment ? post.comment : "ひとことは特になし"}</p>
    `;

    // 削除ボタンの機能付け
    const deleteBtn = item.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      if (confirm("本当にこの投稿を削除しますか？")) {
        deletePost(post.id); // データから削除
        item.remove(); // 画面から削除

        // もし投稿が0になったら「投稿はありません」を復活させる処理があっても良いが、
        // 必須ではないので今回は省略（リロードすれば戻るため）
      }
    });

    return item;
  }

  // 指定したIDのポスを削除する関数
  function deletePost(id) {
    // 指定したID以外のものを残す（＝指定したIDを消す）
    posts = posts.filter((p) => p.id !== id);
    savePosts();
  }

  // 起動時に読み込みを実行
  loadPosts();

  // フォーム送信時のイベント
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // 画面リロードを止める

    // 入力値を取得
    const liveName = document.getElementById("title").value.trim();
    const liveDate = document.getElementById("date").value.trim();
    const liveArea = document.getElementById("area").value.trim();
    const liveNote = document.getElementById("comment").value.trim();

    // かんたんなバリデーション
    if (!liveName || !liveDate || !liveArea) {
      alert("ライブ名・日付・会場は入力してね！");
      return;
    }

    //新しい投稿をオブジェクトとして整理
    const newPost = {
      id: Date.now(), // ユニークなIDを追加
      title: liveName,
      date: liveDate,
      area: liveArea,
      comment: liveNote,
    };

    //新しいポストを配列に追加 (先頭に追加)
    posts.unshift(newPost);

    // 保存
    savePosts();

    // 「まだ投稿はありません。」を消す
    if (emptyMessage) {
      emptyMessage.remove(); // DOMから削除
    }

    // 募集カードを作って表示
    const item = createPostElement(newPost);

    // 一番上に追加
    postList.prepend(item);

    // フォームをリセット
    form.reset();
  });
});
