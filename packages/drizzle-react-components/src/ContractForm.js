import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

/*
 * Create component.
 */

class ContractForm extends Component {
  constructor(props, context) {
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.contracts = context.drizzle.contracts

    // get abi
    const abi = this.contracts[this.props.contract].abi

    console.log('And the contract is...')
    console.log(this.contracts[this.props.contract])

    this.inputs = []
    var initialState = {}

    // Iterate over abi for correct function.
    for (var i = 0; i < abi.length; i++) {
      if (abi[i].name === this.props.method) {
        this.inputs = abi[i].inputs

        for (var i = 0; i < this.inputs.length; i++) {
          initialState[this.inputs[i].name] = ''
        }

        break
      }
    }

    this.state = initialState
  }

  handleSubmit() {
    this.contracts[this.props.contract].methods[this.props.method].cacheSend(
      ...Object.values(this.state)
    )
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  translateType(type) {
    switch (true) {
      case /^uint/.test(type):
        return 'number'
        break
      case /^string/.test(type) || /^bytes/.test(type):
        return 'text'
        break
      case /^bool/.test(type):
        return 'checkbox'
        break
      default:
        return 'text'
    }
  }

  render() {
    return (
      <form className="pure-form pure-form-stacked">
        {this.inputs.map(input => {
          var inputType = this.translateType(input.type)
          // check if input type is struct and if so loop out struct fields as well
          return (
            <input
              key={input.name}
              type={inputType}
              name={input.name}
              value={this.state[input.name]}
              placeholder={input.name}
              onChange={this.handleInputChange}
            />
          )
        })}
        <button
          key="submit"
          className="pure-button"
          type="button"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      </form>
    )
  }
}

ContractForm.contextTypes = {
  drizzle: PropTypes.object
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    contracts: state.contracts
  }
}

export default drizzleConnect(ContractForm, mapStateToProps)
