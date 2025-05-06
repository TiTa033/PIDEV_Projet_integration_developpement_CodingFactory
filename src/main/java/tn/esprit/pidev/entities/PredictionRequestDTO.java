package tn.esprit.pidev.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PredictionRequestDTO {
    @JsonProperty("StudentID")
    private int studentId;
    @JsonProperty("Age")
    private double age;
    @JsonProperty("Gender")
    private int gender;
    @JsonProperty("Ethnicity")
    private int ethnicity;
    @JsonProperty("ParentalEducation")
    private int parentalEducation;
    @JsonProperty("StudyTimeWeekly")
    private double studyTimeWeekly;
    @JsonProperty("Absences")
    private int absences;
    @JsonProperty("Tutoring")
    private int tutoring;
    @JsonProperty("ParentalSupport")
    private int parentalSupport;
    @JsonProperty("Extracurricular")
    private int extracurricular;
    @JsonProperty("Sports")
    private int sports;
    @JsonProperty("Music")
    private int music;
    @JsonProperty("Volunteering")
    private int volunteering;
    @JsonProperty("GPA")
    private double gpa;

    // Getters and Setters (keep the camelCase names in Java)
    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }
    public double getAge() { return age; }
    public void setAge(double age) { this.age = age; }
    public int getGender() { return gender; }
    public void setGender(int gender) { this.gender = gender; }
    public int getEthnicity() { return ethnicity; }
    public void setEthnicity(int ethnicity) { this.ethnicity = ethnicity; }
    public int getParentalEducation() { return parentalEducation; }
    public void setParentalEducation(int parentalEducation) { this.parentalEducation = parentalEducation; }
    public double getStudyTimeWeekly() { return studyTimeWeekly; }
    public void setStudyTimeWeekly(double studyTimeWeekly) { this.studyTimeWeekly = studyTimeWeekly; }
    public int getAbsences() { return absences; }
    public void setAbsences(int absences) { this.absences = absences; }
    public int getTutoring() { return tutoring; }
    public void setTutoring(int tutoring) { this.tutoring = tutoring; }
    public int getParentalSupport() { return parentalSupport; }
    public void setParentalSupport(int parentalSupport) { this.parentalSupport = parentalSupport; }
    public int getExtracurricular() { return extracurricular; }
    public void setExtracurricular(int extracurricular) { this.extracurricular = extracurricular; }
    public int getSports() { return sports; }
    public void setSports(int sports) { this.sports = sports; }
    public int getMusic() { return music; }
    public void setMusic(int music) { this.music = music; }
    public int getVolunteering() { return volunteering; }
    public void setVolunteering(int volunteering) { this.volunteering = volunteering; }
    public double getGpa() { return gpa; }
    public void setGpa(double gpa) { this.gpa = gpa; }
}