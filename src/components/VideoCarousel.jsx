import { hightlightsSlides } from "../constants";
export default function VideoCarousel() {
  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides?.map((list, i) => {
          return (
            <div key={i} id="slider" className="sm:pr-20 pr-10">
              <div className="video-carousel_container">
                <div
                  className="w-full h-full flex-center rounded-3xl overflow-hidden
                  bg-black"
                >
                  <video>
                    <source src={list.video} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
