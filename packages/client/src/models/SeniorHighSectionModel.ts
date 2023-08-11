export class SeniorHighSectionModel {
  classSectionId: number;
  classSectionName: string;
  yearLevelShortName: string;
  seniorHighStrandName: string | undefined;
  seniorHighTrackName: string;

  constructor(modelType: {
    classSectionId: number;
    classSectionName: string;
    yearLevelShortName: string;
    seniorHighStrandName: string | undefined;
    seniorHighTrackName: string;
  }) {
    this.classSectionId = modelType.classSectionId;
    this.classSectionName = modelType.classSectionName;
    this.yearLevelShortName = modelType.yearLevelShortName;
    this.seniorHighStrandName = modelType.seniorHighStrandName;
    this.seniorHighTrackName = modelType.seniorHighTrackName;
  }

  get fullSectionName(): string {
    return `${this.yearLevelShortName} ${
      this.seniorHighStrandName ?? this.seniorHighTrackName
    }-${this.classSectionName}`;
  }
}
