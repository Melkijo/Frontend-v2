"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { PersonIcon, ClockIcon } from "@/public/assets/icons/icons";
import { TextAreaArtikel } from "@/components/forms/TextAreas";
import Input from "@/components/forms/Input";
import { KirimKomentarButton } from "@/components/ui/Button";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import { useArticles } from "@/components/atoms/useArticles";
import {
   EmailShareButton,
   FacebookShareButton,
   TwitterShareButton,
} from "react-share";

const fetcher = (url) => fetch(url).then((res) => res.json());

function fetchArticle(id) {
   const { data: article } = useSWR(
      `https://capstone-project.duckdns.org:8080/articles/${id}`,
      fetcher
   );
   return article;
}

// const comments = [
//    {
//       id: Math.random(),
//       firstName: "Arka",
//       lastName: "Samudra",
//       commentValue:
//          "Saat ini hampir setiap orang mengalami penderitaan akibat pandemi ini. Jika orang tersebut belum siap menghadapi perubahan sosial yang mendadak maka berpotensi timbul depresi dan gangguan kecemasan yang mengancam gangguan mental bila tidak dikelola dengan baik",
//       date: new Date().toLocaleDateString(),
//       time: new Date().toLocaleTimeString(),
//    },
// ];

export default function DetailArticle({ params }) {
   //    const [comment, setComment] = useState(comments);
   const commentTextRef = useRef();
   const firstNameRef = useRef();
   const lastNameRef = useRef();
   const articles = useArticles();
   const { data: article, mutate } = useSWR(
      `https://capstone-project.duckdns.org:8080/articles/${params.id}`,
      fetcher
   );

   const handleSubmit = async (event) => {
      event.preventDefault();

      const newComment = {
         full_name: `${firstNameRef.current?.value}  ${lastNameRef.current?.value}`,
         comment: commentTextRef.current?.value,
      };
      console.log(JSON.stringify(newComment));

      try {
         const response = await fetch(
            `https://capstone-project.duckdns.org:8080/articles/${params.id}/comment`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(newComment),
            }
         );
         if (!response.ok) {
            throw new Error("Error adding article");
         }
         mutate(); // Ini akan melakukan fetch data kembali ke server.
         commentTextRef.current.value = ""; // Kosongkan input komentar
         firstNameRef.current.value = ""; // Kosongkan input nama depan
         lastNameRef.current.value = ""; // Kosongkan input nama belakang
      } catch (error) {
         console.error(error);
      }
   };

   const getArticle = fetchArticle(params.id);

   const url = window.location.href;
   console.log(url);
   const filteredArticles =
      articles && articles.data.filter((article) => article.id != params.id);

   return (
      <>
         <Navbar />

         <article className="mt-[62px] mb-[142px]">
            {getArticle && getArticle ? (
               <>
                  <header className="w-[1440px] mx-auto">
                     <h1 className="font-poppins font-[600] text-[32px] leading-[52px]">
                        {/* Copy Artikel / Ilmuwan di China Sebut COVID-19 Mungkin Berasal
                     dari Manusia, Begini Temuannya */}
                        {getArticle.data.title}
                     </h1>
                     <div className="flex flex-col gap-[22px] font-inter text-[16px] leading-[18px] font-[400] mt-6">
                        <div className="p-[8px] bg-[#E2F0DC] rounded-[3px] max-w-[202px]">
                           <p className="font-poppins font-[600] text-[20px] leading-[30px] text-[#7CA153]">
                              {getArticle.data.category}
                           </p>
                        </div>
                        <p className="font-poppins font-[400] text-[16px] leading-[24px] italic">
                           Dibuat Oleh: {getArticle.data.doctor_name}{" "}
                           {getArticle.data.date}
                        </p>
                     </div>
                  </header>

                  <Image
                     priority
                     alt="images"
                     className="w-full mt-[48px]   h-[680px] object-cover "
                     src={getArticle.data.thumbnail}
                     width={1440}
                     height={5}
                  />

                  <main className="max-w-[1220px] mx-auto">
                     <div className="flex gap-[42px] justify-center my-[32px]">
                        <FacebookShareButton
                           url={url}
                           className="  w-[164px] h-[52px] flex items-center justify-center rounded-[10px]"
                           style={{ backgroundColor: "#DEDEDE" }}
                        >
                           <Image
                              priority
                              alt="images"
                              src="/assets/icons/facebook-icon.svg"
                              width={30}
                              height={30}
                           />
                        </FacebookShareButton>
                        <EmailShareButton
                           url={url}
                           className="  w-[164px] h-[52px] flex items-center justify-center rounded-[10px]"
                           style={{ backgroundColor: "#DEDEDE" }}
                        >
                           <Image
                              priority
                              alt="images"
                              src="/assets/icons/google-icon.svg"
                              width={30}
                              height={30}
                           />
                        </EmailShareButton>
                        <TwitterShareButton
                           url={url}
                           className="  w-[164px] h-[52px] flex items-center justify-center rounded-[10px]"
                           style={{ backgroundColor: "#DEDEDE" }}
                        >
                           <Image
                              priority
                              alt="images"
                              src="/assets/icons/twitter-icon.svg"
                              width={30}
                              height={30}
                           />
                        </TwitterShareButton>
                     </div>
                     <p
                        className="break-all font-inter font-[400] text-[22px] leading-9 text-justify prose max-w-full"
                        dangerouslySetInnerHTML={{
                           __html: getArticle.data.content,
                        }}
                     ></p>
                     <aside className=" mt-[130px] font-inter font-[600] text-[22px] leading-9">
                        <div className="flex justify-between">
                           <div>
                              {filteredArticles.length >= 1 ? (
                                 <>
                                    {" "}
                                    <h2 className="w-[500px] text-left">
                                       {filteredArticles[0].title}
                                    </h2>
                                    <Link
                                       href={`/article/${filteredArticles[0].id}`}
                                       className="font-[500] text-[16px] leading-4 text-[#268AFF]  mt-[18px] flex justify-start"
                                    >
                                       Post Selanjutnya
                                    </Link>
                                 </>
                              ) : null}
                           </div>
                           <div>
                              {filteredArticles.length >= 2 ? (
                                 <>
                                    {" "}
                                    <h2 className="w-[500px] text-right">
                                       {filteredArticles[1].title}
                                    </h2>
                                    <Link
                                       href={`/article/${filteredArticles[1].id}`}
                                       className="font-[500] text-[16px] leading-4 text-[#268AFF]  mt-[18px] flex justify-end"
                                    >
                                       Post Selanjutnya
                                    </Link>
                                 </>
                              ) : null}
                           </div>
                        </div>
                     </aside>
                  </main>
               </>
            ) : (
               <>Loading...</>
            )}

            <section className="max-w-[1220px] mx-auto mt-[70px] mb-[50px]">
               <div>
                  <h3 className="font-inter font-[600] text-[22px] leading-9">
                     Tinggalkan Balasan
                  </h3>
                  <p className="font-inter font-[400] text-[20px] leading-8 mt-[26px]">
                     Alamat email Anda tidak akan dipublikasikan. Ruas yang
                     wajib ditandai *
                  </p>
               </div>
               {getArticle && getArticle.data.comments.length > 0
                  ? getArticle.data.comments.map((item, index) => (
                       <div
                          key={index}
                          className="flex gap-3 items-start my-[50px]"
                       >
                          <Image
                             priority
                             alt="images"
                             src="/assets/icons/profile2-icon.svg"
                             width={40}
                             height={40}
                          />
                          <div>
                             <h4 className="font-poppins font-[500] text-[24px] leading-8 text-[#00000096]">
                                {item.full_name}
                             </h4>
                             <p>{item.comment}</p>
                          </div>
                       </div>
                    ))
                  : null}
               <form onSubmit={handleSubmit} className="flex flex-col gap-9">
                  <div>
                     <textarea
                        ref={commentTextRef}
                        id="message"
                        rows="4"
                        className="block p-2.5 w-full h-[312px] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Comment"
                        required
                     ></textarea>
                  </div>
                  <div className="flex gap-5">
                     <input
                        ref={firstNameRef}
                        type="text"
                        placeholder="First Name"
                        className="block p-2.5 w-full h-[68px] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                     />
                     <input
                        ref={lastNameRef}
                        type="text"
                        placeholder="Last Name"
                        className="block p-2.5 w-full h-[68px] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                     />
                  </div>
                  <KirimKomentarButton type="submit">
                     Kirim Komentar
                  </KirimKomentarButton>
               </form>
            </section>
         </article>
         <Footer />
      </>
   );
}
