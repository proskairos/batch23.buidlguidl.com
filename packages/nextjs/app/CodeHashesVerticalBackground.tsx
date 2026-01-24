import "./HomeStyles.css";
import { InfiniteVerticalScroll } from "~~/components/InfiniteVerticalScroll";
import { type BuilderWithCheckIn, getBuildersAndCheckIns } from "~~/services/graph/client";

export const CodeHashesVerticalBackground = async () => {
  const builders: BuilderWithCheckIn[] = await getBuildersAndCheckIns();

  // Repeat builders to fill screen width
  const repeatedBuilders = builders.length > 0 ? Array(30).fill(builders).flat() : [];

  return (
    <div className="absolute r-0 l-0 w-full h-full b-0 t-0 dark:bg-gray-950 bg-gray-300 overflow-hidden -z-10">
      <div
        className="absolute r-0 l-0 w-full h-full b-0 t-0 dark:bg-gray-950 bg-gray-300 overflow-hidden flex"
        style={{
          WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%)",
          maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%)",
        }}
      >
        <div
          className={`dark:text-green-900/50 text-green-100/75 font-mono flex -space-x-2 ${repeatedBuilders.length ? "animate-fade-in-home" : ""}`}
        >
          {repeatedBuilders.map((builder, index) => {
            const text = `Builder:${builder.address} checkIn hash:${builder.checkIns[0].transactionHash} contract:${builder.checkIns[0].checkInContract}`;
            const duration = `${250 + Math.random() * 150}s`; // Random duration between 250-400s
            return (
              <InfiniteVerticalScroll
                key={`${builder.address}-${index}`}
                delay={`-${Math.random() * 100}s`}
                direction="reverse"
                duration={duration}
              >
                <div
                  className="select-none pointer-events-none"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "upright",
                    whiteSpace: "nowrap",
                    letterSpacing: "-0.05em",
                    background:
                      "linear-gradient(to bottom, rgba(34, 197, 94, 0.4) 0%, currentColor 20%, currentColor 70%, transparent 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {text} {text} {text} {text} {text} {text} {text} {text}
                </div>
              </InfiniteVerticalScroll>
            );
          })}
        </div>
      </div>
      <div className="relative h-full w-full bg-transparent">
        <div
          className="w-1/4 h-full bg-gradient-to-r from-green-600/60 dark:from-green-600/70 via-transparent to-transparent opacity-40 animate-gradient-right pointer-events-none"
          style={{ filter: "blur(192px)" }}
        />
      </div>
    </div>
  );
};
