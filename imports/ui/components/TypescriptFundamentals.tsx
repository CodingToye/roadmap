import React, {useState, useEffect} from "react";
import io from "socket.io-client";
import Block from "./Block";
import CodeBlock from "./CodeBlock";
import Icon from "./Icon";
import {Section} from "../types";

const TypescriptFundamentals = () => {
  const [typescriptFundamentals, setTypescriptFundamentals] = useState<
    Section[]
  >([]);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("initialData", (data) => {
      console.log("Received initial data:", data);
      setTypescriptFundamentals(data.typescriptFundamentals);
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("updateTypescriptFundamentals", (newTypescriptFundamentals) => {
      console.log(
        "Received data (TypeScript Fundamentals):",
        newTypescriptFundamentals
      );
      setTypescriptFundamentals(newTypescriptFundamentals);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    console.log(typescriptFundamentals);

    return () => {
      socket.off("updateTypescriptFundamentals");
      socket.close();
    };
  }, []);

  const toggleBlocks = (sectionIndex: number) => {
    setTypescriptFundamentals((prevSections) =>
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
        {typescriptFundamentals.map(
          (typescriptFundamental, typescriptFundamentalIndex) => (
            <div
              key={typescriptFundamentalIndex}
              className="relative flex flex-col gap-10 mb-10"
            >
              <header className="flex items-center">
                <Icon
                  iconName="radio_button_checked"
                  extraClasses="text-primary relative -left-3"
                />
                <div
                  className="pl-4"
                  onClick={() => toggleBlocks(typescriptFundamentalIndex)}
                >
                  <h1 className="text-2xl text-primary cursor-pointer">
                    {typescriptFundamental.title}
                  </h1>
                  <p className="text-white/50 text-sm">
                    {typescriptFundamental.description}
                  </p>
                </div>
              </header>
              <div className="blocks flex flex-col gap-4">
                {typescriptFundamental.blocks.map((block, blockIndex) => (
                  <Block
                    key={blockIndex}
                    title={block.title}
                    subBlocks={block.subBlocks}
                    meta={block.meta}
                  >
                    {block.description ?? renderDescription(block.description)}
                  </Block>
                ))}
                {typescriptFundamental.codeSample && (
                  <CodeBlock sample={typescriptFundamental.codeSample} />
                )}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default TypescriptFundamentals;
