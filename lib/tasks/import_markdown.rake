namespace :blog do
  desc "Import markdown files from medium directory into blog articles"
  task import_markdown: :environment do
    puts "Starting markdown import..."
    
    importer = MarkdownImporterService.new
    importer.import_all_articles
    
    puts "Markdown import completed!"
    puts "Total articles: #{Article.count}"
  end
end 