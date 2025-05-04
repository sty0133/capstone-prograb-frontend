<template>
  <div class="upload-form">
    <loading-overlay :active="isUploading" :is-full-page="true" />
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <div class="drop-zone" @dragover.prevent @drop.prevent="handleDrop">
      <!-- 파일 리스트 -->
      <ul v-if="selectedFiles.length > 0" class="file-list">
        <li v-for="(file, index) in selectedFiles" :key="index" class="file-item">
          <span class="file-name" :title="file.name">{{ file.name }}</span>
          <button class="remove-button" @click.stop="removeFile(index)">X</button>
        </li>
      </ul>

      <!-- 드롭존 안내 메시지 -->
      <p v-else>PDF 파일을 드래그하거나 클릭하여 업로드하세요. <br/>(최대 3개, 파일당 5MB 이하)</p>

      <!-- 파일 선택 -->
      <input
        type="file"
        accept=".pdf"
        class="file-input"
        multiple
        @change="handleFileSelect"
      />
    </div>

    <!-- 업로드 버튼 -->
    <button
      class="upload-button"
      :disabled="selectedFiles.length === 0 || isUploading"
      @click="uploadFiles"
    >
      {{ isUploading ? '업로드 중...' : '업로드' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import LoadingOverlay from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const emit = defineEmits(['refreshChatList', 'close']) // close 이벤트 추가

const selectedFiles = ref([]) // 선택된 파일 리스트
const isUploading = ref(false)
const errorMessage = ref('') // 경고 메시지

const userStore = useUserStore()

// 파일 이름을 15글자로 제한하고 나머지는 ... 처리
// const truncateFileName = (name) => {
//   return name.length > 15 ? name.slice(0, 15) + '...' : name
// }

// 파일 선택 핸들러
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files) // 선택된 파일 배열로 변환
  const newFiles = files.filter((file) => !selectedFiles.value.some((f) => f.name === file.name)) // 중복 제거

  // 파일 크기 및 개수 검증
  const oversizedFiles = newFiles.filter((file) => file.size > 5 * 1024 * 1024) // 5MB 초과 파일
  const totalFiles = [...selectedFiles.value, ...newFiles]

  if (oversizedFiles.length > 0) {
    errorMessage.value = '5MB를 초과하는 파일이 포함되어 있습니다.'
  } else if (totalFiles.length > 3) {
    errorMessage.value = '최대 3개의 파일만 업로드할 수 있습니다.'
  } else {
    errorMessage.value = '' // 에러 메시지 초기화
    selectedFiles.value = totalFiles.slice(0, 3) // 최대 3개로 제한
  }
}

// 파일 삭제 핸들러
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1) // 선택된 파일 리스트에서 해당 파일 제거
  errorMessage.value = '' // 파일 삭제 시 에러 메시지 초기화
}

// 드래그 앤 드롭 핸들러
const handleDrop = (event) => {
  const files = Array.from(event.dataTransfer.files) // 드롭된 파일 배열로 변환
  const newFiles = files.filter((file) => !selectedFiles.value.some((f) => f.name === file.name)) // 중복 제거

  // 파일 크기 및 개수 검증
  const oversizedFiles = newFiles.filter((file) => file.size > 5 * 1024 * 1024) // 5MB 초과 파일
  const totalFiles = [...selectedFiles.value, ...newFiles]

  if (oversizedFiles.length > 0) {
    errorMessage.value = '5MB를 초과하는 파일이 포함되어 있습니다.'
  } else if (totalFiles.length > 3) {
    errorMessage.value = '최대 3개의 파일만 업로드할 수 있습니다.'
  } else {
    errorMessage.value = '' // 에러 메시지 초기화
    selectedFiles.value = totalFiles.slice(0, 3) // 최대 3개로 제한
  }
}

// 파일 업로드 핸들러
const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return

  const formData = new FormData()
  selectedFiles.value.forEach((file) => {
    formData.append('files', file)
  })

  isUploading.value = true
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/pdf/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userStore.authToken}`,
      },
    })

    if (response.data.status === 'success') {
      alert('파일 업로드 성공!')
      selectedFiles.value = [] // 업로드 성공 후 파일 리스트 초기화
      emit('refreshChatList') // 부모 컴포넌트로 리스트 새로고침 이벤트 전달
      emit('close') // 업로드 성공 시 모달 닫기
    } else {
      alert('파일 업로드 실패: ' + response.data.message)
    }
  } catch (error) {
    console.error('파일 업로드 중 오류 발생:', error)
    alert('파일 업로드 중 오류가 발생했습니다.')
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped>
@import 'vue-loading-overlay/dist/css/index.css';

.upload-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  box-sizing: border-box;
}

.drop-zone {
  width: 100%;
  max-width: 400px;
  height: 150px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #fff;
  cursor: pointer;
  position: relative;
}

.drop-zone p {
  margin: 0;
  color: #666;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-list {
  width: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 5rem; /* 좌우 여백 추가 */
}

.file-name {
  flex: 1;
  text-align: left;
  font-size: 0.9rem; /* 텍스트 크기 조정 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* 텍스트의 최대 폭을 제한 */
}

.remove-button {
  margin-left: 10px;
  background: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  z-index: 10; /* 파일 선택보다 우선되도록 설정 */
}

.upload-button {
  padding: 0.5rem 1rem;
  background-color: #ffe200;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.upload-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>