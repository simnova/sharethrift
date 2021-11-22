import React, { FC, useEffect, useState } from 'react';
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './listing-draft-tags.module.css';


export interface ComponentProp {
  defaultTags: string[];
  getTags: (tags:string[]) => void;
}

export type ComponentProps =  ComponentProp;

export const ListingDraftTags : FC<ComponentProps> = ({
  defaultTags,
  getTags,
}) =>  {
  
  const [tags, setTags] = useState(defaultTags);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  

  //getTags.bind(this, tags);
  
  let newInput: Input | null = null;
  let editInput: Input | null = null;

  const handleClose = (removedTag:string) => {
    const filteredTags = tags.filter(tag => tag !== removedTag);
    console.log(filteredTags);
    setTags(filteredTags);
  };

  useEffect(() => {
    if (inputVisible) {
      newInput?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    getTags(tags);
  }, [tags]);

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    
    if (inputValue && tags.indexOf(inputValue) === -1) {
      let newTags = [...tags, inputValue];
      setTags(newTags);
    }
    setInputVisible(false);
    setInputValue('');
    console.log(tags);
  };

  const handleEditInputChange = (e:React.ChangeEvent<HTMLInputElement>): void => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {

    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');

  };

  const saveInputRef = (inputRef:Input) => {
    newInput = inputRef;
  };

  const saveEditInputRef = (inputRef:Input) => {
    editInput = inputRef;
  };


  return (
    <>
      {tags.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={saveEditInputRef}
              key={tag}
              size="small"
              className={styles['tag-input']}
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }

        const isLongTag = tag.length > 20;

        const tagElem = (
          <Tag
            className={styles['edit-tag']}
            key={tag}
            closable={index !== 0}
            onClose={() => handleClose(tag)}
          >
            <span
              onDoubleClick={e => {
                if (index !== 0) {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  editInput?.focus();
                  e.preventDefault();
                }
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <Input
          ref={saveInputRef}
          type="text"
          size="small"
          className={styles['tag-input']}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag className={styles['site-tag-plus']} onClick={showInput}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </>
  );
  
}