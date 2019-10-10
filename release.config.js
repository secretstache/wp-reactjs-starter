// const isDry = process.argv.indexOf("--dry-run") > -1 || process.argv.indexOf("-d") > -1;

const isPublish = process.env.SEMANTIC_STEP === "publish";

module.exports = {
    branch: "develop",
    ci: false,
    plugins: [
        "@semantic-release/commit-analyzer",
        [
            "@semantic-release/release-notes-generator",
            {
                // Nothing, yet.
            }
        ],
        [
            "@semantic-release/exec",
            {
                // Nothing, yet.
            }
        ],
        [
            "@semantic-release/changelog",
            {
                // Nothing, yet.
            }
        ]
    ].concat(isPublish ? [] : [])
};
