import React, { Component } from 'react';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { 
  getOwnNote, 
  getAverage,
  getOthersNote
} from '../selectors/Notes';
import { vote } from '../actions/Notes';


class NotesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voteOpen: false,
      ownNote: props.ownNote
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ownNote !== this.state.ownNote) {
      this.setState({
        ownNote: nextProps.ownNote
      });
    }
  }

  handleNestedListToggle = () => {
    this.setState({
      voteOpen: !this.state.voteOpen,
    });
  };

  handleNoteChange = (event, index, value) => {
    this.setState({
      ownNote: value
    });
    this.props.vote(this.props.ownName, value);
  }

  getownNote() {
    const { ownName, myProfileName } = this.props;
    if (ownName === null) {
      return (
        <TableRow>
          <TableRowColumn>Ton nom ({myProfileName}) n'est pas dans la liste des votants.</TableRowColumn>
          <TableRowColumn></TableRowColumn>
        </TableRow>
      )
    }

    return (
        <SelectField
          floatingLabelText={`Ma note (${ownName})`}
          style={{width: 200}}
          value={this.state.ownNote}
          onChange={this.handleNoteChange}
        >
          <MenuItem value={-2} primaryText="Exclusion (-2)" />
          <MenuItem value={-1} primaryText="Désaprobation (-1)" />
          <MenuItem value={0} primaryText="Neutre (0)" />
          <MenuItem value={1} primaryText="Approbation (1)" />
          <MenuItem value={2} primaryText="Sélection (2)" />
        </SelectField>
    )
  }

  getDetailsNote() {
    if (!this.state.voteOpen) {
      return null;
    }

    const { othersNote } = this.props;

    let othersNoteRow = othersNote.map((member, i) => {
      if (member[1] !== undefined) {
        return (
          <TableRow key={i}>
            <TableRowColumn>{member[0]}</TableRowColumn>
            <TableRowColumn>{member[1]}</TableRowColumn>
          </TableRow>
        );
      }
      return null;
    });

    return (
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Prénom</TableHeaderColumn>
            <TableHeaderColumn>Note</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {othersNoteRow}
        </TableBody>
      </Table>
    )
    
  }

  render() {
    const iconStyle = {transform: this.state.voteOpen ? 'rotate(180deg)' : 'none'};
    
    return (
      <div>
        <div style={{margin: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{flex: 1}}><strong>Note moyenne :&nbsp;</strong>{this.props.globalNote}</span>
          {this.getownNote()}
          <IconButton            
            onClick={() => this.handleNestedListToggle()}
            touch={true}
            tooltip="Détail des votes"
            >
            <div style={iconStyle}>
              <KeyboardArrowDown />
            </div>
          </IconButton>
        </div>
        {this.getDetailsNote()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const notes = state.notes[state.selectedTalk];
  return {
    ownName: state.ownName,
    ownNote: getOwnNote(notes, state.ownName),
    myProfileName: state.profile.name,
    othersNote: getOthersNote(notes, state.ownName),
    globalNote: state.talks[state.selectedTalk].note
  };
}

const mapDispatchToProps = dispatch => {
  return {
    vote: (name, note) => dispatch(vote(name, note))
  };
}

const Notes = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotesView)

export default Notes;