from rest_framework import serializers

# class UserProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = user_model
#         fields = ['username', 'first_name']

#     def create(self, validated_data):
#         # UserProfile 인스턴스 생성 및 반환
#         return user_model.objects.create(**validated_data)

#     def update(self, instance, validated_data):
#         # UserProfile 인스턴스 업데이트
#         instance.username = validated_data.get('username', instance.username)
#         instance.first_name = validated_data.get('first_name', instance.first_name)
#         instance.save()
#         return instance