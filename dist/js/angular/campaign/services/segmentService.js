(function () {
  'use strict';

  angular.module('olh-lps-campaign')
    .service('SegmentService', [
      function () {
        return {
          getSegments: function () {
            return [
              {
                category: 'Risk Runners Male - Category 1',
                gender: 'Male',
                ageGroup: 'Age Group 40-50',
                race: 'White / Caucasian',
                communication: 'Email',
                behavior: 'High Risk history & Behaviour & Little or no mindfullness regarding Health',
                lifestyle: 'Avoidant or reactive + Healthy but "Live Hard and may die young',
                healthCategories: 'High Risk history',
                users: {
                  count: '2.1',
                  withEmail: '1742',
                  withPhone: '1562'
                }
              },
              {
                category: 'Risk Runners Female - Category 2',
                gender: 'Female',
                ageGroup: 'Age Group 40-50',
                race: 'White / Caucasian',
                communication: 'Text',
                behavior: 'High Risk history & Behaviour & Little or no mindfullness regarding Health',
                lifestyle: 'Avoidant or reactive + Healthy but "Live Hard and may die young',
                healthCategories: 'High Risk history',
                users: {
                  count: '1.7',
                  withEmail: '1242',
                  withPhone: '972'
                }
              },
              {
                category: 'Risk Runners Male - Category 3',
                gender: 'Male',
                ageGroup: 'Age Group 30-40',
                race: 'Asian / Afro American',
                communication: 'Email',
                behavior: 'High Risk history & Behaviour & Little or no mindfullness regarding Health',
                lifestyle: 'Avoidant or reactive + Healthy but "Live Hard and may die young',
                healthCategories: 'High Risk history',
                users: {
                  count: '5',
                  withEmail: '2376',
                  withPhone: '1834'
                }
              },
              {
                category: 'Risk Runners Female - Category 4',
                gender: 'Female',
                ageGroup: 'Age Group 30-40',
                race: 'Asian / Afro American',
                communication: 'Text',
                behavior: 'High Risk history & Behaviour & Little or no mindfullness regarding Health',
                lifestyle: 'Avoidant or reactive + Healthy but "Live Hard and may die young',
                healthCategories: 'High Risk history',
                users: {
                  count: '12',
                  withEmail: '4521',
                  withPhone: '3298'
                }
              },
              {
                category: 'Healthy Strivers Male - Category 1',
                gender: 'Male',
                ageGroup: 'Age Group 40-50',
                race: 'White / Caucasian',
                communication: 'Email',
                behavior: 'Health is OK, but not as fit and robust as desired + mindful regarding health and aware of some personal risks',
                lifestyle: 'Intermittently proactive, but difficulty sustaining change/action + consumer orientation to health care',
                healthCategories: 'Medium Risk',
                users: {
                  count: '2.7',
                  withEmail: '1842',
                  withPhone: '1762'
                }
              },
              {
                category: 'Healthy Strivers Female - Category 2',
                gender: 'Female',
                ageGroup: 'Age Group 40-50',
                race: 'White / Caucasian',
                communication: 'Text',
                behavior: 'Health is OK, but not as fit and robust as desired + mindful regarding health and aware of some personal risks',
                lifestyle: 'Intermittently proactive, but difficulty sustaining change/action + consumer orientation to health care',
                healthCategories: 'Medium Risk',
                users: {
                  count: '2.3',
                  withEmail: '1778',
                  withPhone: '1620'
                }
              },
              {
                category: 'Healthy Strivers Male - Category 3',
                gender: 'Male',
                ageGroup: 'Age Group 30-40',
                race: 'Asian / Afro American',
                communication: 'Email',
                behavior: 'Health is OK, but not as fit and robust as desired + mindful regarding health and aware of some personal risks',
                lifestyle: 'Intermittently proactive, but difficulty sustaining change/action + consumer orientation to health care',
                healthCategories: 'Medium Risk',
                users: {
                  count: '1.1',
                  withEmail: '543',
                  withPhone: '289'
                }
              },
              {
                category: 'Healthy Strivers Female - Category 4',
                gender: 'Female',
                ageGroup: 'Age Group 30-40',
                race: 'Asian / Afro American',
                communication: 'Text',
                behavior: 'Health is OK, but not as fit and robust as desired + mindful regarding health and aware of some personal risks',
                lifestyle: 'Intermittently proactive, but difficulty sustaining change/action + consumer orientation to health care',
                healthCategories: 'Medium Risk',
                users: {
                  count: '6',
                  withEmail: '4326',
                  withPhone: '1268'
                }
              }
            ]
          }
        };
      }
    ]);
})();
