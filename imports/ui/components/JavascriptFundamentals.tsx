import React, {useState, useEffect} from "react";
import io from "socket.io-client";
import Block from "./Block";
import CodeBlock from "./CodeBlock";
import Icon from "./Icon";
import {Section} from "../types";

const JavascriptFundamentals = () => {
  const [javascriptFundamentals, setJavascriptFundamentals] = useState<
    Section[]
  >([]);
  const [hiddenSections, setHiddenSections] = useState<boolean[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("initialData", (data) => {
      console.log("Received initial data:", data);
      setJavascriptFundamentals(data.javascriptFundamentals);
      const initialHiddenSections = new Array(
        data.javascriptFundamentals.length
      ).fill(false);
      const savedHiddenSections = JSON.parse(
        localStorage.getItem("hiddenSections") || "[]"
      );
      setHiddenSections(
        savedHiddenSections.length ? savedHiddenSections : initialHiddenSections
      );
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("updateJavascriptFundamentals", (newJavascriptFundamentals) => {
      console.log(
        "Received data (JavaScript Fundamentals):",
        newJavascriptFundamentals
      );
      setJavascriptFundamentals(newJavascriptFundamentals);
      const initialHiddenSections = new Array(
        newJavascriptFundamentals.length
      ).fill(false);
      const savedHiddenSections = JSON.parse(
        localStorage.getItem("hiddenSections") || "[]"
      );
      setHiddenSections(
        savedHiddenSections.length ? savedHiddenSections : initialHiddenSections
      );
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("updateJavascriptFundamentals");
      socket.close();
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll(".section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("opacity-10");
          } else {
            entry.target.classList.remove("opacity-100");
            entry.target.classList.add("opacity-10");
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const handleUnderstand = (index: number) => {
    setHiddenSections((prevHiddenSections) => {
      const newHiddenSections = prevHiddenSections.map((hidden, idx) =>
        idx === index ? !hidden : hidden
      );
      localStorage.setItem("hiddenSections", JSON.stringify(newHiddenSections));
      return newHiddenSections;
    });
  };

  const toggleBlocks = (sectionIndex: number) => {
    setJavascriptFundamentals((prevSections) =>
      prevSections.map((section, idx) =>
        idx === sectionIndex
          ? {...section, showBlocks: !section.showBlocks}
          : {...section, showBlocks: false}
      )
    );
  };

  const renderDescription = (description: string | undefined) => {
    return description?.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
        <br />
      </React.Fragment>
    ));
  };
  return (
    <section className="flex flex-col items-center">
      <div className="w-full flex flex-col gap-10 relative">
        <div className="border-l border-white/50 absolute top-6 flex h-full"></div>
        {javascriptFundamentals.map(
          (javascriptFundamental, javascriptFundamentalIndex) => (
            <div
              key={javascriptFundamentalIndex}
              className="relative flex flex-col gap-10 mb-10"
            >
              <header className="bg-neutral-base flex justify-between items-end gap-4 -ml-12 p-4 sticky top-0 z-10">
                {/* <Icon
                  iconName="radio_button_checked"
                  extraClasses="text-primary relative -left-3"
                /> */}

                <div
                  className="pl-4"
                  onClick={() => toggleBlocks(javascriptFundamentalIndex)}
                >
                  <h1 className="text-2xl text-primary cursor-pointer">
                    {javascriptFundamental.title}
                  </h1>
                  <p className="text-white/50 text-sm">
                    {javascriptFundamental.description}
                  </p>
                </div>
                <button
                  className={`${
                    hiddenSections[javascriptFundamentalIndex]
                      ? "bg-context-success"
                      : "bg-neutral-light"
                  } border-t border-white/20 px-2 py-1 flex items-center gap-4 rounded text-sm transition`}
                  onClick={() => handleUnderstand(javascriptFundamentalIndex)}
                >
                  {hiddenSections[javascriptFundamentalIndex]
                    ? "Understood"
                    : "Understand"}
                  <Icon
                    iconName={`${
                      hiddenSections[javascriptFundamentalIndex]
                        ? "check"
                        : "question_mark"
                    }`}
                    extraClasses="text-sm"
                  />
                </button>
              </header>
              <div
                className={`blocks flex flex-col gap-4  transition ${
                  hiddenSections[javascriptFundamentalIndex]
                    ? "hidden"
                    : "section"
                }`}
              >
                {javascriptFundamental.blocks.map((block, blockIndex) => (
                  <Block
                    key={blockIndex}
                    title={block.title}
                    subBlocks={block.subBlocks}
                    meta={block.meta}
                    codeSample={block.codeSample}
                  >
                    {block.description ?? renderDescription(block.description)}
                  </Block>
                ))}
                {javascriptFundamental.codeSample && (
                  <CodeBlock sample={javascriptFundamental.codeSample} />
                )}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default JavascriptFundamentals;
