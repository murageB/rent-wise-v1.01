class BlogController < ApplicationController
  def index
    @articles = Article.order(published_at: :desc)
  end

  def show
    @article = Article.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to blog_path, alert: 'Article not found'
  end
end
