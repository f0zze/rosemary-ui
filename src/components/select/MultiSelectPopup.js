import React from 'react';
import find from 'lodash/find';
import Link from '../Link';
import {isDefined, contains, findIdentifiables} from '../../util/utils';
import IconInput from '../IconInput';
import CheckBoxList from './CheckBoxList';
import keyboardNav from './KeyBoardNavigationHOC';

const multiOptionNav = keyboardNav(true);

const PROPERTY_TYPES = {
    placeholder: React.PropTypes.string,
    options: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        displayString: React.PropTypes.string.isRequired
    })),
    onChange: React.PropTypes.func,
    value: React.PropTypes.arrayOf(React.PropTypes.number.isRequired)
};
const DEFAULT_PROPS = {
    placeHolder: 'Search ...'
};

class MultiSelectPopup extends React.Component {

    constructor(props) {
        super(props);
        this._sortSelectedOnTop = this._sortSelectedOnTop.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.state = {
            selected: findIdentifiables(this.props.options, props.value)
        };

        this.state.filtered = this.getAllSorted();
    }

    componentDidMount() {
        if (this.refs.searchInput && this.refs.searchInput.focus) {
            setTimeout(() => this.refs.searchInput.focus(), 0);
        }
    }

    getAllSorted() {
        let result = this.props.options.slice(0);
        result.sort(this._sortSelectedOnTop);
        return result;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            tempSelection: nextProps.tempSelection
        });
        let isValueChanged = nextProps.value !== this.props.value;
        if (isValueChanged) {
            this.setState({selected: findIdentifiables(nextProps.options, nextProps.value)});
        }
    }

    isSelected(option) {
        return this.findOptionInList(this.state.selected, option);
    }

    findOptionInList(list, option) {
        return find(list, (item) => item.id === option.id);
    }

    mergeSelectedOptions(selected) {
        return this.state.selected
            .filter((item) => {
                let found = this.findOptionInList(this.state.filtered, item);
                return !found;
            })
            .concat(selected);
    }

    select(option) {

        let beforeLen = this.state.selected.length;

        let selected = this.state.selected.filter((item) => {
            return item.id !== option.id;
        });

        if (beforeLen === selected.length) {
            selected.push(option);
        }

        this._selectOptions(selected);
    }

    _selectOptions(selected) {
        let selectedMerged = this.mergeSelectedOptions(selected);

        if (!this._isControlled()) {
            this.setState({
                selected: selectedMerged
            });
        }

        this.getInput().focus();

        if (this.props.onChange) {
            this.props.onChange(selectedMerged.map((option) => {
                return option.id;
            }), selectedMerged);
        }
    }

    _sortSelectedOnTop(option1, option2) {
        let isOption1Selected = this.isSelected(option1);
        let isOption2Selected = this.isSelected(option2);

        if (isOption1Selected && !isOption2Selected) {
            return -1;
        } else if (isOption2Selected && !isOption1Selected) {
            return 1;
        } else {
            return option1.displayString.localeCompare(option2.displayString);
        }
    }

    _isControlled() {
        return isDefined(this.props.value);
    }

    _applySearch(value) {
        this.props.resetNavigation();

        let filtered = this.props.options.filter((option) => {
            return contains(option.displayString, value);
        });

        filtered.sort(this._sortSelectedOnTop);

        this.setState({
            filtered: filtered
        });
    }

    getOptions() {
        return this.state.filtered;
    }

    getSelectedOptionEl() {
        return this._checkBoxList.getFocusedEl();
    }

    getInput() {
        return this.refs.searchInput;
    }

    render() {
        return (
            <div className="select__popup">
                <div className="select__search-container">
                    <IconInput
                        onKeyDown={this.props.navigate}
                        ref="searchInput"
                        fluid={true}
                        placeholder={this.props.placeholder}
                        size="sm"
                        onChange={(value) => this._applySearch(value)}
                        className="select__search"
                        iconClassName="im icon-search"/>
                </div>
                <div className="select__clear-btn">
                    <Link className="select__clear-btn" onClick={() => {
                        this._selectOptions([]);
                    }}>
                        Clear all selected
                    </Link>
                </div>
                <div className="select__options">
                    <CheckBoxList
                        ref={(checkBoxList) => this._checkBoxList = checkBoxList}
                        focus={this.state.tempSelection}
                        options={this.state.filtered}
                        onChange={(selected) => this._selectOptions(selected)}
                        value={this.state.selected.map((selected) => {
                            return selected.id;
                        })}
                    />
                </div>
            </div>
        );
    }
}

MultiSelectPopup.propTypes = PROPERTY_TYPES;
MultiSelectPopup.defaultProps = DEFAULT_PROPS;

export default multiOptionNav(MultiSelectPopup);
