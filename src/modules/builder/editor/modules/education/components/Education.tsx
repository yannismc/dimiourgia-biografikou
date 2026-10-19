import React, { ChangeEvent, Fragment, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useEducations } from '@/stores/education';
import { IEducationItem } from '@/stores/education.interface';
import { SwitchWidget } from '@/helpers/common/atoms/Switch';
import { DATE_PICKER_FORMAT } from '@/helpers/constants';
import { getEducationThesis } from '@/helpers/educationThesis';

interface IEducationProps {
  educationInfo: IEducationItem;
  currentIndex: number;
}

const Education: React.FC<IEducationProps> = ({ educationInfo, currentIndex }) => {
  const onChangeHandler = useCallback(
    // oxlint-disable-next-line typescript/no-explicit-any
    (name: string, value: any) => {
      const currentExpInfo = { ...educationInfo };
      if (name === 'thesisTitle' || name === 'thesisDetails') {
        const thesis = getEducationThesis(educationInfo);
        currentExpInfo.thesisTitle = educationInfo.thesisTitle || thesis.title;
        currentExpInfo.thesisDetails = educationInfo.thesisDetails || thesis.details;
        if (thesis.legacyCourseIndex >= 0) {
          currentExpInfo.courses = (educationInfo.courses ?? []).filter(
            (_, index) => index !== thesis.legacyCourseIndex
          );
        }
      }
      switch (name) {
        case 'academyName':
          currentExpInfo.institution = value;
          break;
        case 'degree':
          currentExpInfo.studyType = value;
          break;
        case 'area':
          currentExpInfo.area = value;
          break;
        case 'thesisTitle':
          currentExpInfo.thesisTitle = value;
          break;
        case 'thesisDetails':
          currentExpInfo.thesisDetails = value;
          break;
        case 'grade':
          currentExpInfo.score = value;
          break;
        case 'startDate':
          if (value?.isValid()) {
            currentExpInfo.startDate = value;
          }
          break;
        case 'isStudyingHere':
          currentExpInfo.isStudyingHere = value;
          break;
        case 'endDate':
          if (value?.isValid()) {
            currentExpInfo.endDate = value;
          }
          break;

        default:
          break;
      }
      useEducations.getState().updateEducation(currentIndex, currentExpInfo);
    },
    [currentIndex, educationInfo]
  );

  return (
    <Fragment>
      <TextField
        label="School or College name"
        variant="filled"
        value={educationInfo.institution}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          onChangeHandler('academyName', value);
        }}
        autoComplete="off"
        fullWidth
        required
        autoFocus={true}
        sx={{ marginBottom: '26px' }}
      />
      <TextField
        label="Degree"
        variant="filled"
        value={educationInfo.studyType}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          onChangeHandler('degree', value);
        }}
        autoComplete="off"
        fullWidth
        required
        sx={{ marginBottom: '26px' }}
      />
      <TextField
        label="Area"
        variant="filled"
        value={educationInfo.area}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          onChangeHandler('area', value);
        }}
        autoComplete="off"
        fullWidth
        required
        sx={{ marginBottom: '26px' }}
      />
      <TextField
        label="Thesis title (optional)"
        variant="filled"
        value={educationInfo.thesisTitle || getEducationThesis(educationInfo).title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChangeHandler('thesisTitle', e.target.value);
        }}
        autoComplete="off"
        fullWidth
        sx={{ marginBottom: '26px' }}
      />
      <TextField
        label="Thesis details (optional)"
        variant="filled"
        value={educationInfo.thesisDetails || getEducationThesis(educationInfo).details}
        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          onChangeHandler('thesisDetails', e.target.value);
        }}
        autoComplete="off"
        fullWidth
        multiline
        minRows={3}
        sx={{ marginBottom: '26px' }}
      />
      <TextField
        label="Grade"
        variant="filled"
        value={educationInfo.score}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          onChangeHandler('grade', value);
        }}
        autoComplete="off"
        fullWidth
        required
        sx={{ marginBottom: '26px' }}
      />
      <DatePicker
        label="Start date"
        format={DATE_PICKER_FORMAT}
        value={dayjs(educationInfo.startDate)}
        onChange={(newDate) => {
          onChangeHandler('startDate', newDate);
        }}
        slotProps={{
          textField: { variant: 'filled', fullWidth: true, required: true },
        }}
      />
      <SwitchWidget
        label={'I currently study here'}
        value={educationInfo.isStudyingHere ?? false}
        onChange={(newValue: boolean) => {
          onChangeHandler('isStudyingHere', newValue);
        }}
      />
      <DatePicker
        label="Start date"
        format={DATE_PICKER_FORMAT}
        value={educationInfo.isStudyingHere ? null : dayjs(educationInfo.endDate)}
        onChange={(newDate) => {
          onChangeHandler('endDate', newDate);
        }}
        slotProps={{
          textField: {
            variant: 'filled',
            fullWidth: true,
            required: true,
            sx: { marginBottom: '26px' },
          },
        }}
        disabled={educationInfo.isStudyingHere}
      />
    </Fragment>
  );
};

export default Education;
