'use client';

import Image from 'next/image';

const imgIcon8 = "/assets/products/imgIcon8.svg";
const imgRectangle1213 = "/assets/products/imgRectangle1213.png";

export function ProductsHero() {
  return (
    <div className="flex items-end relative w-full min-h-[56px]" data-name="Hero" data-node-id="4:1681">
      <div className="flex gap-[69px] items-center justify-end relative shrink-0 w-[821.5px] h-[56px] ml-auto" data-name="Sort by" data-node-id="4:1682">
        {/* Sort by button */}
        <div className="bg-[rgba(255,255,255,0.33)] h-[56px] overflow-clip relative rounded-[100px] shrink-0 w-[148px]" data-name="Sort Active" data-node-id="4:1683">
          <div className="absolute left-[20.61%] right-[20.02%] top-[18px] h-[20.53px]" data-node-id="4:1684">
            <p className="absolute font-['Montserrat',sans-serif] font-semibold leading-[normal] left-[20.61%] right-[39.53%] text-[16px] text-[rgba(0,0,0,0.87)] text-center top-[calc(50%-9.97px)]" data-node-id="4:1685">
              Sort by
            </p>
            <div className="absolute inset-[32.14%_20.02%_31.19%_64.53%]" data-name="android-arrow-up" data-node-id="4:1686">
              <div className="absolute inset-0" data-name="Icon_8_" data-node-id="4:1687">
                <Image src={imgIcon8} alt="" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* View controls */}
        <div className="grid grid-cols-[max-content] grid-rows-[max-content] items-start justify-items-start leading-[0] relative shrink-0" style={{ display: 'inline-grid' }} data-name="View" data-node-id="4:1689">
          {/* Grid view container */}
          <div className="col-1 grid grid-cols-[max-content] grid-rows-[max-content] items-start justify-items-start ml-0 mt-0 relative row-1" style={{ display: 'inline-grid' }} data-name="Group" data-node-id="4:1690">
            <div className="bg-[rgba(255,255,255,0.33)] col-1 h-[56px] ml-0 mt-0 rounded-[90px] row-1 w-[129px]" data-name="Rectangle" data-node-id="4:1691" />
            <div 
              className="bg-[rgba(8,202,244,0.7)] col-1 h-[56px] ml-0 mt-0 rounded-bl-[24.5px] rounded-tl-[24.5px] row-1 w-[67px] relative" 
              data-node-id="4:1693"
              style={{ 
                maskImage: `url('${imgRectangle1213}')`,
                WebkitMaskImage: `url('${imgRectangle1213}')`,
                maskSize: '129px 56px',
                maskPosition: '0px 0px',
                maskRepeat: 'no-repeat'
              }}
            />
          </div>

          {/* Grid icon */}
          <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-start justify-items-start ml-[22.5px] mt-[15px] relative row-1" data-name="Grid" data-node-id="4:1694">
            <div className="bg-white col-1 h-[12px] ml-0 mt-0 rounded-[6px] row-1 w-[12.198px]" data-name="Rectangle" data-node-id="4:1695" />
            <div className="bg-white col-1 h-[12px] ml-[16.26px] mt-0 rounded-[6px] row-1 w-[12.198px]" data-name="Rectangle" data-node-id="4:1696" />
            <div className="bg-white col-1 h-[12px] ml-0 mt-[15px] rounded-[6px] row-1 w-[12.198px]" data-name="Rectangle" data-node-id="4:1697" />
            <div className="bg-white col-1 h-[12px] ml-[16.26px] mt-[15px] rounded-[6px] row-1 w-[12.198px]" data-name="Rectangle" data-node-id="4:1698" />
          </div>

          {/* List icon */}
          <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-start justify-items-start ml-[79.5px] mt-[15px] relative row-1" data-name="List" data-node-id="4:1699">
            <div className="bg-[#1a1f21] col-1 h-[6.75px] ml-0 mt-0 rounded-[3px] row-1 w-[7.319px]" data-name="Rectangle" data-node-id="4:1700" />
            <div className="bg-[#1a1f21] col-1 h-[6.75px] ml-[8.95px] mt-0 rounded-[3px] row-1 w-[19.516px]" data-name="Rectangle" data-node-id="4:1701" />
            <div className="bg-[#1a1f21] col-1 h-[6.75px] ml-0 mt-[10.5px] rounded-[3px] row-1 w-[7.319px]" data-name="Rectangle" data-node-id="4:1702" />
            <div className="bg-[#1a1f21] col-1 h-[6.75px] ml-[8.95px] mt-[10.5px] rounded-[3px] row-1 w-[19.516px]" data-name="Rectangle" data-node-id="4:1703" />
            <div className="bg-[#1a1f21] col-1 h-[6.75px] ml-0 mt-[20.25px] rounded-[3px] row-1 w-[7.319px]" data-name="Rectangle" data-node-id="4:1704" />
            <div className="bg-[#1a1f21] col-1 h-[6.75px] ml-[8.95px] mt-[20.25px] rounded-[3px] row-1 w-[19.516px]" data-name="Rectangle" data-node-id="4:1705" />
          </div>
        </div>
      </div>
    </div>
  );
}
