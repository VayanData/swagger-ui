import React, { Component } from "react"
import PropTypes from "prop-types"
import {SyntaxHighlighter, getStyle} from "core/syntax-highlighting"
import get from "lodash/get"
import saveAs from "js-file-download"
import { CopyToClipboard } from "react-copy-to-clipboard"

export default class HighlightCode extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    getConfigs: PropTypes.func.isRequired,
    className: PropTypes.string,
    downloadable: PropTypes.bool,
    fileName: PropTypes.string,
    language: PropTypes.string,
    canCopy: PropTypes.bool
  }

  downloadText = () => {
    saveAs(this.props.value, this.props.fileName || "response.txt")
  }

  preventYScrollingBeyondElement = (e) => {
    const target = e.target

    var deltaY = e.nativeEvent.deltaY
    var contentHeight = target.scrollHeight
    var visibleHeight = target.offsetHeight
    var scrollTop = target.scrollTop

    const scrollOffset = visibleHeight + scrollTop

    const isElementScrollable = contentHeight > visibleHeight
    const isScrollingPastTop = scrollTop === 0 && deltaY < 0
    const isScrollingPastBottom = scrollOffset >= contentHeight && deltaY > 0

    if (isElementScrollable && (isScrollingPastTop || isScrollingPastBottom)) {
      e.preventDefault()
    }
  }

  render () {
    let { value, className, downloadable, getConfigs, canCopy, language } = this.props

    const config = getConfigs ? getConfigs() : {syntaxHighlight: {activated: true, theme: "agate"}}

    className = className || ""

    const codeBlock = get(config, "syntaxHighlight.activated")
      ? <SyntaxHighlighter
          language={language}
          className={className + " microlight"}
          onWheel={this.preventYScrollingBeyondElement}
          style={getStyle(get(config, "syntaxHighlight.theme"))}
          >
          {value}
        </SyntaxHighlighter>
      : <pre onWheel={this.preventYScrollingBeyondElement} className={className + " microlight"}>{value}</pre>

    return (
      <div className="highlight-code">
        { !downloadable ? null :
          <div className="download-contents" onClick={this.downloadText}>
            Download
          </div>
        }

        { !canCopy ? null :
          <div className="copy-to-clipboard">
            <CopyToClipboard text={value}><button type="button" /></CopyToClipboard>
          </div>
        }

        { codeBlock }
      </div>
    )
  }
}
