import React, {Component} from 'react';
import FilterListItems from '../components/FilterListItems.jsx';

class FilterList extends Component {
    render() {
      return(
        <div className="filter">
          <p className="filter-title">{this.props.name}</p>
          <FilterListItems data={this.props.data} editButton={this.props.editButton} iconName={this.props.iconName} toggleAction={this.props.toggleAction} editAction={this.props.editAction} onChange={this.props.onCheckChange}/>
        </div>
      );
    }
}

export default FilterList;
