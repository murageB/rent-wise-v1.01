class AiArticleService
  def initialize
    @openai_client = nil # Will be configured with API key
    setup_openai_client
  end

  def generate_article(topic, style = 'professional')
    return "AI service not configured. Please set up OpenAI API key." unless @openai_client

    prompt = build_generation_prompt(topic, style)
    
    begin
      response = @openai_client.chat(
        parameters: {
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are an expert property management content writer specializing in blockchain technology and real estate innovation." },
            { role: "user", content: prompt }
          ],
          max_tokens: 2000,
          temperature: 0.7
        }
      )
      
      response.dig("choices", 0, "message", "content") || "Failed to generate content"
    rescue => e
      "Error generating content: #{e.message}"
    end
  end

  def optimize_seo(content)
    return "AI service not configured. Please set up OpenAI API key." unless @openai_client

    prompt = build_seo_prompt(content)
    
    begin
      response = @openai_client.chat(
        parameters: {
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are an SEO expert specializing in property management and blockchain content optimization." },
            { role: "user", content: prompt }
          ],
          max_tokens: 1500,
          temperature: 0.5
        }
      )
      
      response.dig("choices", 0, "message", "content") || "Failed to optimize content"
    rescue => e
      "Error optimizing content: #{e.message}"
    end
  end

  def generate_meta_description(title, content)
    return "AI service not configured. Please set up OpenAI API key." unless @openai_client

    prompt = "Generate a compelling meta description (max 160 characters) for this article:\n\nTitle: #{title}\n\nContent preview: #{content[0..200]}..."

    begin
      response = @openai_client.chat(
        parameters: {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an SEO expert. Generate concise, compelling meta descriptions." },
            { role: "user", content: prompt }
          ],
          max_tokens: 100,
          temperature: 0.3
        }
      )
      
      response.dig("choices", 0, "message", "content")&.strip || "Failed to generate meta description"
    rescue => e
      "Error generating meta description: #{e.message}"
    end
  end

  def suggest_keywords(title, content)
    return "AI service not configured. Please set up OpenAI API key." unless @openai_client

    prompt = "Suggest 5-8 relevant keywords for this property management article:\n\nTitle: #{title}\n\nContent: #{content[0..500]}..."

    begin
      response = @openai_client.chat(
        parameters: {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an SEO expert. Suggest relevant keywords for property management content." },
            { role: "user", content: prompt }
          ],
          max_tokens: 150,
          temperature: 0.3
        }
      )
      
      response.dig("choices", 0, "message", "content")&.strip || "Failed to suggest keywords"
    rescue => e
      "Error suggesting keywords: #{e.message}"
    end
  end

  def auto_schedule_articles
    # AI-powered content scheduling
    topics = [
      "Blockchain in Property Management",
      "Smart Contracts for Rent Collection",
      "Property Management Automation",
      "Tenant Experience Technology",
      "Real Estate Investment Strategies",
      "Property Maintenance Optimization",
      "Digital Transformation in Real Estate",
      "Sustainable Property Management"
    ]

    scheduled_articles = []
    topics.each_with_index do |topic, index|
      scheduled_date = Time.current + (index * 7).days
      content = generate_article(topic, 'informative')
      
      scheduled_articles << {
        title: topic,
        content: content,
        published_at: scheduled_date,
        author: 'AI Assistant',
        featured: index < 2,
        status: 'scheduled'
      }
    end

    scheduled_articles
  end

  def analyze_performance(article)
    # AI-powered content performance analysis
    return "AI service not configured. Please set up OpenAI API key." unless @openai_client

    prompt = "Analyze this article for engagement potential and suggest improvements:\n\nTitle: #{article.title}\n\nContent: #{article.content[0..1000]}..."

    begin
      response = @openai_client.chat(
        parameters: {
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a content performance analyst specializing in property management content." },
            { role: "user", content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.3
        }
      )
      
      response.dig("choices", 0, "message", "content") || "Failed to analyze performance"
    rescue => e
      "Error analyzing performance: #{e.message}"
    end
  end

  private

  def setup_openai_client
    api_key = ENV['OPENAI_API_KEY']
    return unless api_key.present?

    require 'openai'
    @openai_client = OpenAI::Client.new(access_token: api_key)
  rescue LoadError
    Rails.logger.warn "OpenAI gem not installed. Run: bundle add ruby-openai"
  end

  def build_generation_prompt(topic, style)
    case style
    when 'professional'
      "Write a professional article about '#{topic}' in the context of property management and blockchain technology. Include practical insights, technical details, and actionable advice. Use markdown formatting with headings, bullet points, and code examples where appropriate."
    when 'casual'
      "Write a casual, engaging article about '#{topic}' for property managers and real estate professionals. Make it conversational and easy to understand, with real-world examples and practical tips."
    when 'technical'
      "Write a technical deep-dive article about '#{topic}' focusing on blockchain implementation, smart contracts, and technical architecture. Include code examples, diagrams descriptions, and detailed explanations."
    else
      "Write an informative article about '#{topic}' in the context of property management technology. Balance technical details with practical applications."
    end
  end

  def build_seo_prompt(content)
    "Optimize this content for SEO while maintaining readability and value:\n\n#{content}\n\nFocus on:\n- Improving readability\n- Adding relevant keywords naturally\n- Optimizing headings and structure\n- Enhancing meta descriptions\n- Making content more engaging"
  end
end 