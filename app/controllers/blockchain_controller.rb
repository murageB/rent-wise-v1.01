class BlockchainController < ApplicationController
  before_action :authenticate_user!
  
  def status
    @blockchain_service = BlockchainService.new
    @network_status = @blockchain_service.network_status
    @latest_block = @blockchain_service.get_latest_block_number
    
    respond_to do |format|
      format.html
      format.json { render json: { status: @network_status, latest_block: @latest_block } }
    end
  end

  def property_data
    property_id = params[:property_id]
    @blockchain_service = BlockchainService.new
    
    if params[:action_type] == 'store'
      data_hash = params[:data_hash]
      transaction_hash = @blockchain_service.store_property_data(property_id, data_hash)
      render json: { 
        success: true, 
        transaction_hash: transaction_hash,
        message: "Property data stored on blockchain"
      }
    else
      property_data = @blockchain_service.get_property_data(property_id)
      render json: { 
        success: true, 
        property_data: property_data
      }
    end
  end

  def verify_integrity
    property_id = params[:property_id]
    expected_hash = params[:expected_hash]
    
    @blockchain_service = BlockchainService.new
    is_valid = @blockchain_service.verify_data_integrity(property_id, expected_hash)
    
    render json: { 
      success: true, 
      integrity_valid: is_valid,
      property_id: property_id
    }
  end

  def latest_blocks
    @blockchain_service = BlockchainService.new
    latest_block = @blockchain_service.get_latest_block_number
    
    blocks = []
    (0..4).each do |i|
      block_number = latest_block - i
      break if block_number < 0
      
      block_data = @blockchain_service.get_block(block_number)
      blocks << {
        number: block_number,
        hash: block_data&.dig('hash'),
        timestamp: block_data&.dig('timestamp')&.to_i(16),
        transactions_count: block_data&.dig('transactions')&.length || 0
      }
    end
    
    render json: { 
      success: true, 
      blocks: blocks,
      latest_block: latest_block
    }
  end
end 