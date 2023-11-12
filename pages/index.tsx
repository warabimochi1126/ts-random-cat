import { GetServerSideProps, NextPage } from "next";
import { useState, useEffect } from "react";
import styles from "./index.module.css";

//  getServerSidePropsから渡されるPropsの型
type Props = {
  initialImageUrl: string
}

const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  const [ imageUrl, setImageUrl ] = useState(initialImageUrl);
  const [ loading, setLoading ] = useState(false);

  // useEffect(() => {
  //   fetchImage().then((newImage) => {
  //     setImageUrl(newImage.url)
  //     setLoading(false);
  //   })
  // }, []);

  const handleClick = async () => {
    setLoading(true);
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  }

  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>
        One more Cat!
      </button>
      <div className={styles.frame}>
        {loading || <img src={imageUrl} className={styles.img} />}
      </div>
    </div>
  );
};
export default IndexPage;

//  サーバサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url,
    },
  };
}

//  レスポンスで返ってくる画像情報の型を定義する.
//  レスポンスにはurlプロパティ以外も含まれているが、url以外使わないので他のプロパティは定義しない.必要になったタイミングで追加すれば良い
type Image = {
  url: string;
};

//  関数の戻り値に作成した型注釈を挿入する.
const fetchImage = async () : Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images = await res.json();
  console.log(images);
  // console.log(images[0]);
  return images[0];
}



/**
 * NextPageはページコンポーネントを表す型
 * 
 * SSR -> webアプリのレンダリングをサーバサイドでサーバサイドで行う技術のこと.
 * SSRではサーバがHTMLを生成して、ブラウザに送信する
 * 
 * データフェッチAPIについて
 * getServerSideProps -> ページがリクエストされるたびにサーバサイドで実行されてページのプロパティを返す関数.リクエストごとにページのデータを取得出来る
 * CSRでルーティングされた時もサーバサイドで関数が実行される
 * getStaticProps -> 静的生成されるページのデータを取得する関数.ビルド時にページのデータを取得しておき、リクエストが飛んできた時にそのキャッシュからデータを返すようになる
 * リクエスト時に発火しないので静的なページでしか使えない
*/