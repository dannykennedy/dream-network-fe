const editorConfig = {
    options: ["inline", "link", "image", "blockType", "history"],
    inline: {
        options: ["bold", "italic", "superscript"],
    },
    blockType: {
        inDropdown: false,
        options: ["Normal", "H2", "Blockquote"],
        className: "editor-blocktype-picker",
    },
    image: {
        urlEnabled: true,
        uploadEnabled: true,
        alignmentEnabled: false,
        previewImage: true,
        inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
        alt: { present: true, mandatory: false },
        defaultSize: {
            height: "auto",
            width: "auto",
        },
    },
    link: {
        inDropdown: false,
        options: ["link", "unlink"],
        defaultTargetOption: "_blank",
    },
};

export default editorConfig;
