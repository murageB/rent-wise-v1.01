class MarkdownImporterService
  def initialize
    @medium_dir = Rails.root.join('medium')
  end

  def import_all_articles
    markdown_files = Dir.glob(File.join(@medium_dir, '*.md'))
    
    markdown_files.each do |file_path|
      import_article_from_file(file_path)
    end
  end

  def import_article_from_file(file_path)
    content = File.read(file_path)
    filename = File.basename(file_path, '.md')
    @file_path = file_path
    
    # Extract title from first line (assuming it's a markdown heading)
    title = extract_title(content)
    
    # Generate medium URL based on filename
    medium_url = generate_medium_url(filename)
    
    # Find or create article
    article = Article.find_or_initialize_by(title: title)
    
    # Update article with full markdown content
    article.assign_attributes(
      content: content,
      author: 'RentWise Team',
      published_at: determine_publish_date(filename),
      medium_url: medium_url,
      featured: determine_if_featured(filename)
    )
    
    if article.save
      Rails.logger.info "Imported article: #{title}"
    else
      Rails.logger.error "Failed to import article: #{title} - #{article.errors.full_messages.join(', ')}"
    end
  end

  private

  def extract_title(content)
    # Extract title from first line that starts with #
    first_line = content.lines.first&.strip
    if first_line&.start_with?('#')
      # Remove # symbols and clean up
      title = first_line.gsub(/^#+\s*/, '').strip
      # Remove any markdown formatting
      title.gsub(/\*\*(.*?)\*\*/, '\1').gsub(/\*(.*?)\*/, '\1')
    else
      # Fallback to filename
      File.basename(@file_path, '.md').titleize
    end
  end

  def generate_medium_url(filename)
    # Convert filename to medium URL format
    slug = filename.gsub(/^\d+-/, '').gsub('-', '-')
    "https://medium.com/@rentwise/#{slug}"
  end

  def determine_publish_date(filename)
    # Extract date from filename if it exists (e.g., 01-2024-01-15)
    if filename.match(/^\d+-\d{4}-\d{2}-\d{2}/)
      date_str = filename.match(/^\d+-\d{4}-\d{2}-\d{2}/)[0]
      parts = date_str.split('-')
      Date.new(parts[1].to_i, parts[2].to_i, parts[3].to_i)
    else
      # Default to recent dates based on filename order
      case filename
      when /01-/
        1.week.ago
      when /02-/
        3.days.ago
      when /03-/
        1.day.ago
      else
        6.hours.ago
      end
    end
  end

  def determine_if_featured(filename)
    # Mark first two articles as featured
    filename.match(/^(01|02)-/)
  end
end 