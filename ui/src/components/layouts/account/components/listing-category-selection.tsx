import { TreeSelect } from "antd"
export const ListingCategorySelection: React.FC<any> = (props) => {
  return (
    <TreeSelect
      onChange={props.onChange}
      value={props.value}
      style={{ width: "100%" }}
      treeDataSimpleMode = {{
        id:'id',
        pId:'parentId.id',
        rootPId:undefined
      }}
      fieldNames = {{
        label:'name',
        value:'id'
      }} 
      treeData = {props.data}
      />
  )
}