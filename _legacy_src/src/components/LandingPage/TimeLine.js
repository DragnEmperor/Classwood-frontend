import React from "react";
import "../../style/timeline.css";
export default function TimeLine() {
  return (
    <div>
      <h1 className="mx-10 text-5xl font-semibold text-center sec-head md:mx-20 lg:mx-48">
        Simplify processes and intelligently manage your institute is just 3
        steps away!
      </h1>
      <section id="cd-timeline" className="cd-container">
        <div className="cd-timeline-block">
          <div className="cd-timeline-img cd-timeline-img3 cd-picture"></div>

          <div className="cd-timeline-content">
            <h1 className="text-[#17B21A]">STEP 1</h1>
            <h2>Register Your Institute</h2>

            <p>
              It all starts a click. Make it memorable. Start your Journey. Make
              Your Institute a SMART institute.
            </p>
          </div>
        </div>

        <div className="cd-timeline-block">
          <div className="cd-timeline-img cd-timeline-img2 cd-movie"></div>

          <div className="cd-timeline-content">
            <h1 className="text-[#EE751E]">STEP 2</h1>
            <h2>Create Staff and Classes</h2>
            <p>Let your staff and students know how smart we have become. </p>
          </div>
        </div>

        <div className="cd-timeline-block">
          <div className="cd-timeline-img cd-timeline-img1 cd-picture"></div>

          <div className="cd-timeline-content">
            <h1 className="text-[#146FB5]">STEP 3</h1>

            <h2>Start Relaxing</h2>
            <p>
              This is what it all comes down to Your to. Your smart Institute is
              ready! Are you?
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
