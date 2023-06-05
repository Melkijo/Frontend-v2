import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function DoctorCard({ image, name, title, work_time, href }) {
   return (
      <div className="bg-neutral-0 rounded-[5px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] flex flex-row gap-1.5 items-center justify-center shrink-0 w-[374px] h-[145px] relative">
         <Image src={image} alt="doctor" width={129} height={146} className="flex-1 h-[146px] w-[129px] relative" />

         <div className="flex flex-col gap-2.5 items-start justify-start flex-1 relative">
            <div className="flex flex-col gap-2 items-start justify-start shrink-0 relative">
               <div className="flex flex-col gap-2 items-start justify-start shrink-0 relative">
                  <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                     <div className="font-poppins font-[500] text-[16px] text-neutral-900 text-left relative w-[239px]">{name}</div>

                     <div className="font-poppins font-normal text-[14px] text-neutral-900/50 text-left relative w-[102.45px] whitespace-nowrap">{title}</div>
                  </div>
                  <div className="bg-[#d8d8d8] rounded pt-1 pr-[5px] pb-1 pl-[5px] flex flex-row gap-[3px] items-center justify-center shrink-0 w-[61px] h-5 relative">
                     <div className="font-poppins font-normal text-[8px] text-neutral-900 text-left relative">{work_time} Tahun</div>
                  </div>
               </div>
            </div>
            <Link href={href} className="font-normal font-poppins text-neutral-0 text-left  bg-web-green-300 hover:bg-web-green-400 rounded-xl pt-4 pr-3 pb-4 pl-3 flex flex-row gap-2.5 items-center justify-center shrink-0 w-[84px] h-[31px] relative" style={{ font: "16px/120%" }} prefetch={false}>
               Detail
            </Link>
         </div>
      </div>
   );
}
