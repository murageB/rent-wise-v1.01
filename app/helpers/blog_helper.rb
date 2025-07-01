module BlogHelper
  def render_markdown(content)
    return '' if content.blank?
    
    markdown = Redcarpet::Markdown.new(
      Redcarpet::Render::HTML.new(
        hard_wrap: true,
        link_attributes: { target: '_blank' }
      ),
      extensions = {
        fenced_code_blocks: true,
        no_intra_emphasis: true,
        autolink: true,
        strikethrough: true,
        lax_html_blocks: true,
        superscript: true,
        tables: true
      }
    )
    
    markdown.render(content).html_safe
  end
end
