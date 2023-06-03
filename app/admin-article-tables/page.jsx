"use client";

import SidebarAdmin from "@/components/ui/SidebarAdmin";
import React, { useState } from "react";
import { button_variants } from "@/components/custom/custom";
import PaginationAlt from "@/components/ui/PaginationAlt";
import useSWR, { mutate } from "swr";

// This is purposefully left inefficient, due to time constraint

//Any API changes later should refer to the comments for guidance!
export default function AdminArticleTables() {
   const [currentPage, setCurrentPage] = useState(1);
   const [baseIndex, setBaseIndex] = useState(0);
   const [articlesPerPage] = useState(13);

   //Fetch the data from API
   const fetcher = (url) => fetch(url).then((res) => res.json());
   const {
      data: articleData,
      error,
      mutate: mutateArticleData,
   } = useSWR(
      "https://642ace62b11efeb759a35fe4.mockapi.io/doctorarticle",
      fetcher,
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   // Calculate the indexes of the articles to be displayed on the current page
   const indexOfLastArticle = currentPage * articlesPerPage;
   const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;

   // Slice the articleData array to get the articles for the current page
   const currentArticles = articleData
      ? articleData.slice(indexOfFirstArticle, indexOfLastArticle)
      : [];

   // Calculate the total number of pages based on the articlesPerPage
   const totalPages = Math.ceil((articleData?.length || 0) / articlesPerPage);

   // Handle the Page changes from Pagination
   const handlePageChange = (page) => {
      setCurrentPage(page);
      setBaseIndex(1 + articlesPerPage * (page-1));
   };

   // Handle Actions
   const handleArticleAccept = (e) => {};
   const handleArticleReject = (e) => {};
   const handleArticleDelete = async (id) => {
      Swal.fire({
         title: "Apakah Anda yakin?",
         text: "Apakah kamu yakin ingin menghapus artikel ini?",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Ya!",
         cancelButtonText: "Batal",
      }).then(async (result) => {
         if (result.isConfirmed) {
            try {
               const response = await fetch(
                  `https://642ace62b11efeb759a35fe4.mockapi.io/doctorarticle/${id}`,
                  {
                     method: "DELETE",
                  }
               );

               if (response.ok) {
                  const updatedData = articleData.filter(
                     (article) => article.id !== id
                  );
                  mutateArticleData(updatedData, false);
                  Swal.fire("Terhapus!", "Data telah dihapus.", "success");
               } else {
                  console.error("Gagal menghapus data:", response);
                  throw new Error("Gagal menghapus data");
               }
            } catch (error) {
               Swal.fire("Terjadi kesalahan", error.message, "error");
            }
         }
      });
   };

   return (
      <>
         <div className="py-[50px] px-[65px] flex flex-row gap-[65px] items-start justify-start relative">
            <div className="py-[50px] px-[65px] flex flex-col gap-10 items-end justify-end relative">
               <div className="flex flex-col gap-6 items-start justify-start shrink-0 relative">
                  <div className="p-2.5 flex flex-row gap-2.5 items-start justify-start shrink-0 relative">
                     <div className="font-poppins font-bold text-xl text-web-green-500 text-left relative">
                        Artikel Dokter
                     </div>
                  </div>
                  <div className="flex flex-row gap-0 items-start justify-start shrink-0 relative">
                     <input
                        type="text"
                        className="font-poppins font-normal text-xs/[120%] text-neutral-900 text-left relative border-solid border-web-green-300 border pt-2.5 pr-0 pb-2.5 pl-2.5 flex flex-row gap-2.5 items-center justify-start shrink-0 w-[559px] h-[50px]"
                        placeholder="Cari Artikel"
                     />
                     <button className="font-poppins font-semibold text-xs/[120%] text-neutral-0 text-left bg-web-green-300 pt-4 pr-3 pb-4 pl-3 flex flex-row gap-2.5 items-center justify-center shrink-0 w-[81px] h-[50px] relative">
                        Cari
                     </button>
                  </div>
                  <div className="flex flex-row gap-0 items-start justify-start shrink-0 relative">
                     <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                        <table className="border-collapse border border-success-green-100 w-full">
                           <thead className="">
                              <tr className="bg-[#7CA153] font-semibold h-[43px]">
                                 {" "}
                                 <th className=" w-[82px] px-4 py-3 text-white">
                                    No
                                 </th>
                                 <th className=" w-[372px] text-white">
                                    Nama Dokter
                                 </th>
                                 <th className="text-white w-[225px]">
                                    Judul Artikel
                                 </th>
                                 <th className="text-white w-[183px] ">
                                    Kategori
                                 </th>
                                 <th className=" text-white w-[131px]">
                                    Tanggal
                                 </th>
                                 <th className=" text-white w-[317px]">Aksi</th>
                              </tr>
                           </thead>
                           <tbody className="">
                              {currentArticles &&
                                 currentArticles.map((article, index) => (
                                    <tr key={article.id}>
                                       <td className="border border-success-green-100 text-center ">
                                          {baseIndex + index}
                                       </td>
                                       <td className="border border-success-green-100 pl-2 ">
                                          {article.writer}
                                       </td>
                                       <td className="border border-success-green-100 text-center ">
                                          {article.title}
                                       </td>
                                       <td className="border border-success-green-100 text-center ">
                                          {article.category}
                                       </td>
                                       <td className="border border-success-green-100 text-center ">
                                          {article.date}
                                       </td>

                                       <td className="border border-success-green-100 text-center flex justify-center px-10 gap-2">
                                          <button
                                             className={button_variants({
                                                variant: "default",
                                                size: "default",
                                             })}
                                             onClick={() =>
                                                handleArticleAccept(article.id)
                                             }
                                             style={{
                                                marginTop: 18.5,
                                                marginBottom: 18.5,
                                             }}
                                          >
                                             Unggah
                                          </button>
                                          <button
                                             className={button_variants({
                                                variant: "warning",
                                                size: "default",
                                             })}
                                             onClick={() =>
                                                handleArticleReject(article.id)
                                             }
                                             style={{
                                                marginTop: 18.5,
                                                marginBottom: 18.5,
                                             }}
                                          >
                                             Tolak
                                          </button>
                                          <button
                                             className={button_variants({
                                                variant: "danger",
                                                size: "default",
                                             })}
                                             onClick={() =>
                                                handleArticleDelete(article.id)
                                             }
                                             style={{
                                                marginTop: 18.5,
                                                marginBottom: 18.5,
                                             }}
                                          >
                                             Hapus
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
               <div>
                  <PaginationAlt
                     currentPage={currentPage}
                     articlePerPages={articlesPerPage}
                     totalPages={totalPages}
                     onPageChange={handlePageChange}
                  />
               </div>
            </div>
         </div>
      </>
   );
}