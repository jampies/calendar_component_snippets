import React from 'react';
import styles from './AssignmentSelector.scss';
import TeamMemberName from '$views/TeamMemberName/TeamMemberName';
import Icon from '$components/Icon/Icon';
import { COLOURS_AMOUNT } from '$config/constants';
import classnames from 'classnames';

export class AssignmentSelector extends React.Component {
  constructor () {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleSelectTeamMember = this.handleSelectTeamMember.bind(this);
  }

  teamMemberMouseEntry (e) {
    e.stopPropagation();
  }

  handleClick (e) {
    e.stopPropagation();
    const { onOpen, onClose, isOpen } = this.props;
    isOpen ? onClose() : onOpen();
  }

  handleSelectTeamMember (e, tm) {
    const { updateShiftAssignment, shiftId, onClose } = this.props;
    e.stopPropagation();

    if (!tm.clashingAssignment) {
      updateShiftAssignment(tm.id, shiftId);
      onClose();
    }
  }

  render () {
    const { availableTeamMembers, assignedTeamMemberId, isOpen, isSmall, isHovered } = this.props;

    const unassign = { id: null, name: 'Clear assignment', italic: true };
    const dropDownOptions = [unassign, ...availableTeamMembers];
    const selectedValueClasses = classnames({
      [styles.selectedValue]: true,
      [styles.isSmall]: isSmall
    });
    const dropdownClasses = classnames({
      [styles.teamMembersDropdown]: true,
      [styles.isSmall]: isSmall
    });

    return (
      <div className={styles.assignmentSelector}>
        <div className={styles.visibleContainer}>
          {<div className={selectedValueClasses} onClick={this.handleClick}>
            {assignedTeamMemberId ? <TeamMemberName teamMemberId={assignedTeamMemberId} /> : <span>Unassigned</span>}
            {isOpen ? <Icon.ChevronUp /> : <Icon.ChevronDown />}
          </div>}
        </div>
        {(isOpen || (isSmall && isHovered)) && <div className={dropdownClasses}>
          {
            dropDownOptions.map(tm => (
              <div
                className={classnames({
                  [styles.teamMemberContainer]: true,
                  [styles.isSelected]: tm.id === assignedTeamMemberId,
                  [styles.isDisabled]: tm.clashingAssignment,
                  [styles.italic]: tm.italic
                })}
                key={tm.id}
                title={tm.clashingAssignment ? 'Cannot assign team member as it would cause a clash with another shift' : ''}
                onMouseOver={this.teamMemberMouseEntry}
                onClick={(e) => this.handleSelectTeamMember(e, tm)}>
                <div className={`${styles.colourTag} colour-${tm.id % COLOURS_AMOUNT + 1}-background`} />
                <div className={`${styles.label} listOptionLabel`}>{tm.name}</div>
              </div>
            ))
          }
        </div>}
      </div>
    );
  }
}

export default AssignmentSelector;
