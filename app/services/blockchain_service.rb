require 'net/http'
require 'json'

class BlockchainService
  QUORUM_RPC_URL = 'http://localhost:8545'
  
  def initialize
    @rpc_url = QUORUM_RPC_URL
  end

  # Get the latest block number
  def get_latest_block_number
    response = make_rpc_call('eth_blockNumber', [])
    return nil unless response['result']
    response['result'].to_i(16)
  end

  # Get block information
  def get_block(block_number)
    hex_block = "0x#{block_number.to_s(16)}"
    response = make_rpc_call('eth_getBlockByNumber', [hex_block, false])
    response['result']
  end

  # Get account balance
  def get_balance(address)
    response = make_rpc_call('eth_getBalance', [address, 'latest'])
    return nil unless response['result']
    response['result'].to_i(16)
  end

  # Send a transaction (basic implementation)
  def send_transaction(from_address, to_address, value, private_key = nil)
    # This is a simplified implementation
    # In production, you'd need proper transaction signing
    transaction = {
      from: from_address,
      to: to_address,
      value: "0x#{value.to_s(16)}",
      gas: "0x186A0", # 100,000 gas
      gasPrice: "0x3B9ACA00" # 1 gwei
    }
    
    response = make_rpc_call('eth_sendTransaction', [transaction])
    response['result']
  end

  # Store property data on blockchain (simplified)
  def store_property_data(property_id, data_hash)
    # This would typically involve a smart contract
    # For now, we'll just return a mock transaction hash
    "0x#{SecureRandom.hex(32)}"
  end

  # Get property data from blockchain
  def get_property_data(property_id)
    # This would typically involve a smart contract call
    # For now, return mock data
    {
      property_id: property_id,
      data_hash: "0x#{SecureRandom.hex(32)}",
      timestamp: Time.current.to_i,
      block_number: get_latest_block_number
    }
  end

  # Verify data integrity
  def verify_data_integrity(property_id, expected_hash)
    stored_data = get_property_data(property_id)
    stored_data[:data_hash] == expected_hash
  end

  # Get network status
  def network_status
    begin
      response = make_rpc_call('eth_syncing', [])
      {
        connected: true,
        syncing: response['result'] != false,
        latest_block: get_latest_block_number,
        timestamp: Time.current
      }
    rescue => e
      {
        connected: false,
        error: e.message,
        timestamp: Time.current
      }
    end
  end

  private

  def make_rpc_call(method, params)
    uri = URI(@rpc_url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.read_timeout = 10
    
    request = Net::HTTP::Post.new(uri)
    request['Content-Type'] = 'application/json'
    request.body = {
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: 1
    }.to_json

    response = http.request(request)
    JSON.parse(response.body)
  rescue => e
    Rails.logger.error "Blockchain RPC call failed: #{e.message}"
    { 'error' => e.message }
  end
end 