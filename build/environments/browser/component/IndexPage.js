import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSelect } from "react-with-native-select";
import Image from "next/image";
import { useState, useEffect } from "react";
import { schemas } from "../example-schemas";
/**
Simple UI like https://rjsf-team.github.io/react-jsonschema-form/

- Show a list of ActionSchema examples that all use different OpenAPIs like OpenAI and Deepgram
- Show a button to setup your authentication such as the authorization keys for different platforms.
- Show the ActionSchema
- When a plugin is selected in the text-box, render the form with rjsf
- When no plugin is selected, show the indexed-db data.
*/
export const IndexPage = () => {
    const items = [
        {
            label: "Example 1",
            value: "example1.schema.json",
            data: schemas.example1,
            group: "Code From Anywhere",
        },
        {
            label: "Example 2",
            value: "example2.schema.json",
            data: schemas.example2,
            group: "Code From Anywhere",
        },
        {
            label: "Example 3",
            value: "example3.schema.json",
            data: schemas.example3,
            group: "Code From Anywhere",
        },
        {
            label: "Example 4",
            value: "example4.schema.json",
            data: schemas.example4,
            group: "OpenAI",
        },
        {
            label: "Example 5",
            value: "example5.schema.json",
            data: schemas.example5,
            group: "OpenAI",
        },
    ];
    const [showSetup, setShowSetup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const initialDataValue = "Please run";
    const [data, setData] = useState(initialDataValue);
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        window.localStorage.setItem("code", JSON.stringify(items[0].data, undefined, 2));
    }, []);
    const [SelectActionSchema, selectedActionSchemaItem] = useSelect(items, items[0], (item) => {
        const url = item?.value;
        if (!url || !item.data) {
            return;
        }
        // Set the value, reset the data
        setData(initialDataValue);
        window.localStorage.setItem("code", JSON.stringify(item.data, undefined, 2));
    });
    // Should come from what we do on the TextArea
    const isPluginSelected = false;
    const header = (_jsxs("div", { className: "flex flex-row justify-between items-center", children: [_jsxs("div", { className: "flex flex-row gap-8 items-center", children: [_jsx("a", { href: "/", className: "flex items-center justify-center px-4 text-3xl", children: _jsx(Image, { priority: true, loading: "eager", src: `/logo.png`, width: 50, className: "dark:invert", height: 40, alt: "logo" }) }), _jsx(SelectActionSchema, {}), _jsx("div", { className: "cursor-pointer select-none", onClick: () => setShowSetup((v) => !v), children: showSetup ? "Let's go" : "Setup" })] }), _jsx("iframe", { src: "https://ghbtns.com/github-btn.html?user=codefromanywhere&repo=actionschema&type=star&count=true&size=large", frameBorder: "0", scrolling: "0", width: "170", height: "46", className: "my-2 p-2 bg-white rounded-md", title: "GitHub" })] }));
    const leftPanelContent = showSetup ? (_jsx("div", { children: "Show setup" })) : (_jsx("iframe", { width: "100%", height: "100%", src: `/editor.html` }, selectedActionSchemaItem?.value));
    const rightPanelContent = isPluginSelected ? (_jsx("div", { children: "Plugin form coming here" })) : (_jsx("textarea", { disabled: true, value: JSON.stringify(data, undefined, 2), className: "flex flex-1 bg-transparent focus:outline-none p-2" }));
    const statusIcon = (_jsx("div", { className: "absolute -left-11 top-[51%] rounded-full w-20 h-20 border-dotted border-black dark:!border-white border-[6px] bg-white dark:!bg-black flex items-center justify-center cursor-pointer", children: _jsx("div", { className: "relative", children: _jsx(Image, { priority: true, loading: "eager", className: isLoading
                    ? "animate-ping dark:invert"
                    : "ml-2 rotate-90 hover:scale-150 transform transition-all dark:invert", src: `/logo.png`, width: 50, height: 40, alt: "logo" }) }) }));
    return (_jsxs("div", { className: "w-screen h-screen flex flex-1 flex-col", children: [header, _jsxs("div", { className: "grid grid-cols-2 flex-1", children: [_jsx("div", { className: "flex flex-1", children: leftPanelContent }), _jsxs("div", { className: "flex flex-1 relative border-dotted border-l-[6px] border-black dark:!border-white pl-2", children: [statusIcon, rightPanelContent] })] })] }));
};
//# sourceMappingURL=IndexPage.js.map