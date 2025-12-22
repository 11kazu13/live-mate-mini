// ページの読み込みが完了してから実行
document.addEventListener("DOMContentLoaded", () => { // Documet(HTML) Object Modelの略 HTMLをオブジェクトのように扱う。
  const form = document.getElementById("postForm");
  const postList = document.getElementById("postList");
  const emptyMessage = document.getElementById("emptyMessage");

  let posts = []; // 投稿を格納する配列

  // 【JSONサーバー版】初期化：LocalStorageからデータを読み込む
  async function loadPosts() { // asyncによりawaitが使用可能になる
      try {
          const res = await fetch("http://localhost:3001/posts?_sort=id&_order=desc");
          const data = await res.json();

          posts = data;

          if (posts.length > 0) {
              if (emptyMessage) emptyMessage.remove();

              posts.forEach((post) => {
                  const item = createPostElement(post);
                  postList.appendChild(item);
              });
          }
      } catch (err) {
          console.error("読み込み失敗", err);
          alert("サーバーから読み込めなかった（json-server起動してる？）");
      }
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
    deleteBtn.addEventListener("click", async () => {
      if (confirm("本当にこの投稿を削除しますか？")) {
        await deletePost(post.id); // サーバーから削除
        item.remove(); // 画面から削除
      }
    });

    return item;
  }

  // 【JSONサーバー版】指定したIDのポストを削除する関数
  async function deletePost(id) {
      try {
          await fetch(`http://localhost:3001/posts/${id}`, {
              method: "DELETE",
          });

          // メモリ側も合わせる
          posts = posts.filter((p) => p.id !== id);
      } catch (err) {
          console.error("削除失敗", err);
          alert("削除できなかった（json-server起動してる？）");
      }
  }

  // 起動時に読み込みを実行
  loadPosts();

  // 【JSONサーバー版】フォーム送信時のイベント
  form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const liveName = document.getElementById("title").value.trim();
      const liveDate = document.getElementById("date").value.trim();
      const liveArea = document.getElementById("area").value.trim();
      const liveNote = document.getElementById("comment").value.trim();

      if (!liveName || !liveDate || !liveArea) {
          alert("ライブ名・日付・会場は入力してね！");
          return;
      }

      const newPost = {
          title: liveName,
          date: liveDate,
          area: liveArea,
          comment: liveNote,
      };

      try {
          const res = await fetch("http://localhost:3001/posts", { // サーバーに接触
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newPost),
          });

          const saved = await res.json(); //サーバーから返却

          // UI更新（先頭に出す）
          if (emptyMessage) emptyMessage.remove();
          const item = createPostElement(saved);
          postList.prepend(item);

          // メモリ側も合わせる
          posts.unshift(saved);

          form.reset();
      } catch (err) {
          console.error("投稿失敗", err);
          alert("投稿できなかった（json-server起動してる？）");
      }
   });
});
