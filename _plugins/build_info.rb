# The version shown in the footer, linked to GitHub.
# Deploys run from a v* tag (GITHUB_REF_NAME). Other builds use the tag on
# HEAD if there is one, else the short commit hash.
require "open3"

module BuildInfo
  class Generator < Jekyll::Generator
    priority :highest

    def generate(site)
      repo_url = site.config["repo_url"]
      site.data["build"] = { "version" => "", "version_url" => "" }

      ref = ENV.fetch("GITHUB_REF_NAME", "")
      tag = ref.start_with?("v") ? ref : git(site, "describe", "--tags", "--exact-match", "HEAD")
      unless tag.empty?
        site.data["build"] = { "version" => tag, "version_url" => "#{repo_url}/releases/tag/#{tag}" }
        return
      end

      sha = ENV.fetch("GITHUB_SHA", "")[0, 7]
      sha = git(site, "rev-parse", "--short", "HEAD") if sha.empty?
      site.data["build"] = { "version" => sha, "version_url" => "#{repo_url}/commit/#{sha}" } unless sha.empty?
    end

    private

    def git(site, *args)
      out, status = Open3.capture2("git", *args, chdir: site.source, err: File::NULL)
      status.success? ? out.strip : ""
    rescue SystemCallError
      ""
    end
  end
end
