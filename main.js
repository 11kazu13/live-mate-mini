// ページの読み込みが完了してから実行
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("postForm");
  const postList = document.getElementById("postList");
  const emptyMessage = document.getElementById("emptyMessage");

  const posts = []; //投稿を格納する配列

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
      title: liveName,
      date: liveDate,
      area: liveArea,
      comment: liveNote,
    };

    console.log(posts);

    //新しいポストを配列に追加
    posts.unshift(newPost);



    // 「まだ投稿はありません。」を消す
    if (emptyMessage) {
      emptyMessage.remove();
    }

    // 募集カードを作る
    const item = document.createElement("article");
    item.className = "post-item";

    item.innerHTML = `
      <h3 class="post-title">${liveName}</h3>
      <p class="post-meta">${liveDate} ｜ ${liveArea}</p>
      <p class="post-note">${liveNote ? liveNote : "ひとことは特になし"}</p>
    `;

    // 一番上に追加（新しい募集が上に来るイメージ）
    postList.prepend(item);

    // フォームをリセット
    form.reset();
  });
});
