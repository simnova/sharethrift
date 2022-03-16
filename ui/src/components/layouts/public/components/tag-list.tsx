import { Checkbox, CheckboxOptionType } from 'antd';

export interface TagListProps {
  data: {
    tags:{
      count: number,
      value:string
    }[],
    selectedTags:string[]
  } 
  onChange: (checkedValues: string[]) => void;

}

export const TagList: React.FC<TagListProps> = (props) => {

  const getOptions = ():CheckboxOptionType[] => {  
    if(!props.data || !props.data.tags) { return [] }
    return props.data.tags.map((tag:any) => {
      return {
        label:`${tag.value} (${tag.count})`,
        value:tag.value 
      } as CheckboxOptionType
    })
  }

  return(
    <div>
      <Checkbox.Group options={getOptions()} value={props.data.selectedTags} onChange={(value) => props.onChange(value.map(x => x.toString()))} />
    </div>
  )

}