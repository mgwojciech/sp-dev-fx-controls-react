import * as React from 'react';
import { ITermAction, ITermActionsControlProps, ITermActionsControlState, TermActionsDisplayMode, TermActionsDisplayStyle } from './ITermsActions';
import { DropdownTermAction } from './DropdownTermAction';
import ButtonTermAction from './ButtonTermAction';

export default class TermActionsControl extends React.Component<ITermActionsControlProps, ITermActionsControlState> {

  constructor(props: ITermActionsControlProps) {
    super(props);

    const { termActions } = this.props;

    const displayMode = termActions.termActionsDisplayMode ? termActions.termActionsDisplayMode : TermActionsDisplayMode.buttons;
    const displayStyle = termActions.termActionsDisplayStyle ? termActions.termActionsDisplayStyle : TermActionsDisplayStyle.text;

    this.state = {
      availableActions: [],
      displayMode,
      displayStyle
    };
  }

  /**
   * componentWillMount lifecycle hook
   */
  public componentWillMount(): void {
    const { term, termActions } = this.props;

    // Prepare list of the available actions
    const availableActions: ITermAction[] = termActions.actions.filter(async (termAction) => { return await termAction.applyToTerm(term); });

    this.setState({
      availableActions
    });
  }

  /**
   * Default React render method
   */
  public render(): React.ReactElement<ITermActionsControlProps> {
    const { term } = this.props;
    const { displayStyle, displayMode, availableActions } = this.state;

    if (!availableActions || availableActions.length <= 0 || !term) {
      return null;
    }

    return (
      <div>
        {
          displayMode == TermActionsDisplayMode.dropdown ?
            <DropdownTermAction key={`DdAction-${term.Id}`} termActions={availableActions} term={term} displayStyle={displayStyle} termActionCallback={this.props.termActionCallback} spTermService={this.props.spTermService} />
            :
            <ButtonTermAction key={`BtnAction-${term.Id}`} termActions={availableActions} term={term} displayStyle={displayStyle} termActionCallback={this.props.termActionCallback} spTermService={this.props.spTermService} />
        }
      </div>
    );
  }
}