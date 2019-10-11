const releaseBranch = "master",
    branch = process.env.BRANCH || releaseBranch,
    commitAnalyzer = "@semantic-release/commit-analyzer",
    releaseNotesGenerator = [
        "@semantic-release/release-notes-generator",
        {
            linkCompare: false,
            linkReferences: false,
            writerOpts: {
                groupBy: false
            }
        }
    ],
    changeLog = "@semantic-release/changelog",
    execYarnVersion = "yarn version --no-git-tag-version --new-version ${nextRelease.version}";

module.exports =
    branch === releaseBranch
        ? {
              // Main release branch
              branch: branch,
              plugins: [
                  commitAnalyzer,
                  releaseNotesGenerator,
                  changeLog,
                  [
                      "@semantic-release/exec",
                      {
                          prepareCmd: execYarnVersion
                      }
                  ],
                  [
                      "@semantic-release/gitlab",
                      {
                          assets: [{ path: "dist/*.zip", label: "Installable plugin" }],
                          assets: [{ path: "docs", label: "Technical documentation" }]
                      }
                  ]
              ]
          }
        : {
              // Steps to get the current version, BRANCH=develop yarn semantic-release
              // See also https://git.io/Jelnu
              branch: branch,
              ci: false,
              plugins: [
                  commitAnalyzer,
                  releaseNotesGenerator,
                  changeLog,
                  [
                      "@semantic-release/exec",
                      {
                          prepareCmd: [
                              execYarnVersion,
                              "echo Exit with error due to prevent publishing here",
                              "exit 1" // Always exit so no publish takes place
                          ].join(" && ")
                      }
                  ]
              ]
          };
