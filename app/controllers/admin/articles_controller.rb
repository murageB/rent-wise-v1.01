class Admin::ArticlesController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin_role
  before_action :set_article, only: [:show, :edit, :update, :destroy, :preview, :publish, :unpublish]
  before_action :require_admin_session

  def index
    @articles = Article.order(published_at: :desc)
    @total_articles = Article.count
    @published_articles = Article.where('published_at <= ?', Time.current).count
    @draft_articles = Article.where('published_at > ? OR published_at IS NULL', Time.current).count
    @featured_articles = Article.where(featured: true).count
  end

  def show
  end

  def new
    @article = Article.new
    @article.published_at = Time.current
    @article.author = current_user.name
  end

  def create
    @article = Article.new(article_params)
    @article.author = current_user.name unless @article.author.present?
    
    if @article.save
      redirect_to admin_articles_path, notice: 'Article was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @article.update(article_params)
      redirect_to admin_articles_path, notice: 'Article was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @article.destroy
    redirect_to admin_articles_path, notice: 'Article was successfully deleted.'
  end

  def preview
    # Preview the article as it would appear on the blog
    render layout: 'application'
  end

  def publish
    @article.update(published_at: Time.current)
    redirect_to admin_articles_path, notice: 'Article was successfully published.'
  end

  def unpublish
    @article.update(published_at: Time.current + 1.year)
    redirect_to admin_articles_path, notice: 'Article was successfully unpublished.'
  end

  def ai_generate
    # AI-powered article generation
    topic = params[:topic] || params.dig(:article, :title)
    style = params[:style] || 'professional'
    
    @generated_content = AiArticleService.new.generate_article(topic, style)
    render json: { content: @generated_content }
  end

  def ai_optimize
    # AI-powered SEO optimization
    content = params[:content] || params.dig(:article, :content)
    
    @optimized_content = AiArticleService.new.optimize_seo(content)
    render json: { content: @optimized_content }
  end

  def ai_suggest_keywords
    # AI-powered keyword suggestion
    title = params[:title] || params.dig(:article, :title)
    content = params[:content] || params.dig(:article, :content)
    
    @suggested_keywords = AiArticleService.new.suggest_keywords(title, content)
    render json: { keywords: @suggested_keywords }
  end

  def ai_generate_meta_description
    # AI-powered meta description generation
    title = params[:title] || params.dig(:article, :title)
    content = params[:content] || params.dig(:article, :content)
    
    @meta_description = AiArticleService.new.generate_meta_description(title, content)
    render json: { meta_description: @meta_description }
  end

  private

  def set_article
    @article = Article.find(params[:id])
  end

  def article_params
    params.require(:article).permit(:title, :content, :author, :published_at, :medium_url, :featured, 
                                   :meta_description, :keywords, :category, :status, :seo_title)
  end

  def require_admin_role
    unless current_user.role == 'admin' || current_user.role == 'landlord'
      redirect_to root_path, alert: 'Access denied. Admin privileges required.'
    end
  end

  def require_admin_session
    timeout = 1.hour
    if !session[:admin_logged_in] || session[:admin_logged_in_at].blank? || (Time.current - session[:admin_logged_in_at] > timeout)
      reset_session
      redirect_to new_user_session_path, alert: 'Admin login required or session expired.'
    end
  end
end
