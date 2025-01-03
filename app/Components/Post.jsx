import React from "react";
import { sql } from "../Db";
import {
  collection,
  getDoc,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import Posts from "./Posts";
export default async function Post() {
  const db = getFirestore(sql);
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const quarySnapshot = await getDoc(q);
  let data = []
  quarySnapshot.forEach((doc)=>{
    data.push({id: doc.id , ...doc.data()})
  })
  return (
    <div>
      {/* {
        data.map((posts)=>{
          <Posts key={posts.id} posts={posts}/>
        })
      } */}
    </div>
  )
}